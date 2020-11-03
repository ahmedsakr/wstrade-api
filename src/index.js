import endpoints, { ORDERS_PER_PAGE } from './api/endpoints';
import { handleRequest } from './network/https';
import auth from './auth';
import headers from './headers';


// Checks if a security trades on TSX or TSX-V
const isCanadianSecurity = (exchange) => ['TSX', 'TSX-V'].includes(exchange)

const wealthsimple = {
  
  auth,
  headers,

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   */
  getAccounts: async () => handleRequest(endpoints.ACCOUNT_IDS, {}),

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   */
  getAccountData: async () => handleRequest(endpoints.LIST_ACCOUNT, {}),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: async (interval, accountId) =>
    handleRequest(endpoints.HISTORY_ACCOUNT, { interval, accountId }),
  
  /**
   * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
   *
   */
  getActivities: async () => handleRequest(endpoints.ACTIVITIES, {}),

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   */
  getBankAccounts: async () => handleRequest(endpoints.BANK_ACCOUNTS, {}),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   */
  getDeposits: async () => handleRequest(endpoints.DEPOSITS, {}),

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   */
  getExchangeRates: async () => handleRequest(endpoints.EXCHANGE_RATES, {}),
  
  /**
   * Lists all positions in the specified trading account under the WealthSimple Trade Account.
   * 
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getPositions: async (accountId) =>
    handleRequest(endpoints.POSITIONS, { accountId }),

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} page The orders page index to seek to
   */
  getOrdersByPage: async (accountId, page) =>
    handleRequest(endpoints.ORDERS_BY_PAGE, {
      offset: (page - 1) * ORDERS_PER_PAGE,
      accountId
    }),

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getOrders: async (accountId) =>
    handleRequest(endpoints.ALL_ORDERS, {
      offset: 0,
      accountId
    }),

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getPendingOrders: async (accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'submitted'
    }),
  
  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getFilledOrders: async (accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'posted'
    }),

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *

   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getCancelledOrders: async (accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'cancelled'
    }),

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} orderId The pending order to cancel
   */
  cancelOrder: async (orderId) => handleRequest(endpoints.CANCEL_ORDER, { orderId }),

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  cancelPendingOrders: async (accountId) => {
    const pending = await wealthsimple.getPendingOrders(accountId);
    return Promise.all(pending.orders.map(async (order) => await wealthsimple.cancelOrder(order.order_id)));
  },

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from the symbol with a colon, for example: AAPL:NASDAQ, ENB:TSX
   * @param {string} ticker.symbol The security symbol.
   * @param {string} [ticker.exchange] (optional) the exchange the security trades in
   * @param {string} [ticker.id] (optional) The internal WealthSimple Trade security ID
   * @param {boolean} extensive Pulls a more detailed report of the security using the /securities/{id} API
   */
  getSecurity: async (ticker, extensive) => {
    if (typeof (ticker) === 'string') {
      ticker = {
        symbol: ticker
      };
      let tickerParts = ticker.symbol.split(':');
      if (tickerParts.length > 2) {
        return Promise.reject({reason: `Illegal ticker: ${ticker.symbol}`});
      }
      ticker.exchange = tickerParts[1];
      ticker.symbol = tickerParts[0];
    }

    if (ticker.id) {
      
      /*
       * There is no need to filter results based on exchange because we are given the unique id.
       * 
       * We will immediately call the extensive details API since we have the id.
       */
      return await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: ticker.id });
    }

    let queryResult = await handleRequest(endpoints.SECURITY, { ticker: ticker.symbol });
    queryResult = queryResult.filter(security => security.stock.symbol === ticker.symbol);

    if (ticker.exchange) {
      queryResult = queryResult.filter(security => security.stock.primary_exchange === ticker.exchange);
    }

    if (queryResult.length > 1) {
      return Promise.reject({reason: 'Multiple securities matched query.'});
    } else if (queryResult.length === 0) {
      return Promise.reject({reason: 'No securities matched query.'});
    }

    if (extensive) {

      // The caller has opted to receive the extensive details about the security.
      return await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: queryResult[0].id });
    }

    return queryResult[0];
  },

  /**
   * Market buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketBuy: async (accountId, ticker, quantity) => {
    let extensive_details = await wealthsimple.getSecurity(ticker, true);

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: extensive_details.id,
      limit_price: extensive_details.quote.amount,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "market",
      time_in_force: "day",
      account_id: accountId
    });
  },

  /**
   * Limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  placeLimitBuy: async (accountId, ticker, limit, quantity) =>
    handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "limit",
      time_in_force: "day",
      account_id: accountId
    }),

  /**
   * Stop limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  placeStopLimitBuy: async (accountId, ticker, stop, limit, quantity) => {
    
    let security = await wealthsimple.getSecurity(ticker);

    // The WealthSimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      return Promise.reject({ reason: "TSX/TSX-V securities must have an equivalent stop and limit price." });
    }

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(ticker)).id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "stop_limit",
      time_in_force: "day",
      account_id: accountId
    });
  },

  /**
   * Market sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketSell: async (accountId, ticker, quantity) => {

    let extensive_details = await wealthsimple.getSecurity(ticker, true);
    
    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: extensive_details.id,
      market_value: extensive_details.quote.amount,
      quantity: quantity,
      order_type: "sell_quantity",
      order_sub_type: "market",
      time_in_force: "day",
      account_id: accountId,
    });
  },

  /**
   * Limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  placeLimitSell: async (accountId, ticker, limit, quantity) =>
    handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "sell_quantity",
      order_sub_type: "limit",
      time_in_force: "day",
      account_id: accountId
    }),

  /**
   * Stop limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  placeStopLimitSell: async (accountId, ticker, stop, limit, quantity) => {

    let security = await wealthsimple.getSecurity(ticker);

    // The WealthSimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      return Promise.reject({ reason: "TSX/TSX-V securities must have an equivalent stop and limit price." });
    }

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: security.id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: "sell_quantity",
      order_sub_type: "stop_limit",
      time_in_force: "day",
      account_id: accountId
    });
  }
}

export default wealthsimple;
