import fetch from 'node-fetch';
import endpoints, { isSuccessfulRequest, ORDERS_PER_PAGE } from './endpoints';

// Checks if a security trades on TSX or TSX-V
const isCanadianSecurity = (exchange) => ['TSX', 'TSX-V'].includes(exchange)

let customHeaders = new fetch.Headers();

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data, and the authentication tokens.
 */
async function handleRequest(endpoint, data, tokens) {
  try {

    // Submit the HTTP request to the WealthSimple Trade Servers
    const response = await talk(endpoint, data, tokens);

    if (isSuccessfulRequest(response.status)) {
      return endpoint.onSuccess({
        arguments: data,
        response
      }, tokens);
    } else {
      return Promise.reject(await endpoint.onFailure(response));
    }

  } catch (error) {

    // This is likely a network error; throw it to the caller to deal with.
    throw error;
  }
}

/*
 * Complete the URL by filling the parameter placeholders with the
 * data arguments.
 */
function finalizeRequest(endpoint, data) {

  // No need to do anything if the URL is static (no parameters)
  if (!endpoint.parameters) {
    return { url: endpoint.url, payload: data };
  }

  // Swap all the parameter placeholders with the arguments.
  let url = endpoint.url;
  for (let index = 0; index < Object.keys(endpoint.parameters).length; index++) {
    if (data[endpoint.parameters[index]] === null || data[endpoint.parameters[index]] === undefined) {
      throw new Error("URL Path parameter missing");
    }

    url = url.replace(`{${index}}`, data[endpoint.parameters[index]]);
    delete data[endpoint.parameters[index]];
  }

  return { url, payload: data };
}

/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */
function talk(endpoint, data, tokens) {
  let headers = new fetch.Headers();
  headers.append('Content-Type', 'application/json');

  // Apply all custom headers
  [...customHeaders].forEach(header => headers.append(...header));

  if (tokens) {
    headers.append('Authorization', `${tokens.access}`)
  }

  // Make a copy of the arguments so the original copy is not modified
  let copy = Object.assign({}, data);

  // fill path and query parameters in the URL
  let { url, payload } = finalizeRequest(endpoint, copy);

  return fetch(url, {
    body: ['GET', 'DELETE'].includes(endpoint.method) ? undefined : JSON.stringify(payload),
    method: endpoint.method,
    headers: headers
  })
}

const wealthsimple = {
    
  /**
   * Attempts to create a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   */
  login: async (email, password) =>
    handleRequest(endpoints.LOGIN, { email, password }),

  /**
   * Generates a new set of access and refresh tokens.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  refresh: async (tokens) =>
    handleRequest(endpoints.REFRESH, { refresh_token: tokens.refresh}, tokens),

  /**
   * Appends a header name-value pair to all requests.
   * 
   * @param {*} name Header key
   * @param {*} value Header value
   */
  addHeader: (name, value) => customHeaders.append(name, value),

  /**
   * Removes a custom header from all requests.
   * 
   * @param {*} name Header key
   */
  removeHeader: (name) => customHeaders.delete(name),

  /**
   * Clears all custom headers.
   */
  clearHeaders: () => [...customHeaders].forEach(header => customHeaders.delete(header[0])),

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccounts: async (tokens) =>
    handleRequest(endpoints.ACCOUNT_IDS, {}, tokens),

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccountData: async (tokens) =>
    handleRequest(endpoints.LIST_ACCOUNT, {}, tokens),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: async (tokens, interval, accountId) =>
    handleRequest(endpoints.HISTORY_ACCOUNT, { interval, accountId }, tokens),
  
  /**
   * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.ss
   */
  getActivities: async (tokens) =>
    handleRequest(endpoints.ACTIVITIES, {}, tokens),

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getBankAccounts: async (tokens) =>
    handleRequest(endpoints.BANK_ACCOUNTS, {}, tokens),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getDeposits: async (tokens) =>
    handleRequest(endpoints.DEPOSITS, {}, tokens),

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getExchangeRates: async (tokens) =>
    handleRequest(endpoints.EXCHANGE_RATES, {}, tokens),
  
  /**
   * Lists all positions in the specified trading account under the WealthSimple Trade Account.
   * 
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getPositions: async (tokens, accountId) =>
    handleRequest(endpoints.POSITIONS, { accountId }, tokens),

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} page The orders page index to seek to
   */
  getOrdersByPage: async (tokens, accountId, page) =>
    handleRequest(endpoints.ORDERS_BY_PAGE, {
      offset: (page - 1) * ORDERS_PER_PAGE,
      accountId
    }, tokens),

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getOrders: async (tokens, accountId) =>
    handleRequest(endpoints.ALL_ORDERS, {
      offset: 0,
      accountId
    }, tokens),

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getPendingOrders: async (tokens, accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'submitted'
    }, tokens),
  
  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getFilledOrders: async (tokens, accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'posted'
    }, tokens),

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getCancelledOrders: async (tokens, accountId, ticker) =>
    handleRequest(endpoints.FILTERED_ORDERS, {
      accountId,
      ticker,
      status: 'cancelled'
    }, tokens),

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} orderId The pending order to cancel
   */
  cancelOrder: async (tokens, orderId) =>
    handleRequest(endpoints.CANCEL_ORDER, { orderId }, tokens),

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  cancelPendingOrders: async (tokens, accountId) => {
    const pending = await wealthsimple.getPendingOrders(tokens, accountId);
    return Promise.all(pending.orders.map(async (order) => await wealthsimple.cancelOrder(tokens, order.order_id)));
  },

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from the symbol with a colon, for example: AAPL:NASDAQ, ENB:TSX
   * @param {string} ticker.symbol The security symbol.
   * @param {string} [ticker.exchange] (optional) the exchange the security trades in
   * @param {string} [ticker.id] (optional) The internal WealthSimple Trade security ID
   * @param {boolean} extensive Pulls a more detailed report of the security using the /securities/{id} API
   */
  getSecurity: async (tokens, ticker, extensive) => {
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
      return await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: ticker.id }, tokens);
    }

    let queryResult = await handleRequest(endpoints.SECURITY, { ticker: ticker.symbol }, tokens);
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
      return await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: queryResult[0].id }, tokens);
    }

    return queryResult[0];
  },

  /**
   * Market buy a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketBuy: async(tokens, accountId, ticker, quantity) => {
    let extensive_details = await wealthsimple.getSecurity(tokens, ticker, true);

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: extensive_details.id,
      limit_price: extensive_details.quote.amount,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "market",
      time_in_force: "day",
      account_id: accountId
    }, tokens);
  },

  /**
   * Limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  placeLimitBuy: async(tokens, accountId, ticker, limit, quantity) =>
    handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "limit",
      time_in_force: "day",
      account_id: accountId
    }, tokens),

  /**
   * Stop limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  placeStopLimitBuy: async(tokens, accountId, ticker, stop, limit, quantity) => {
    
    let security = await wealthsimple.getSecurity(tokens, ticker);

    // The WealthSimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      return Promise.reject({ reason: "TSX/TSX-V securities must have an equivalent stop and limit price." });
    }

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "stop_limit",
      time_in_force: "day",
      account_id: accountId
    }, tokens);
  },

  /**
   * Market sell a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketSell: async(tokens, accountId, ticker, quantity) => {

    let extensive_details = await wealthsimple.getSecurity(tokens, ticker, true);
    
    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: extensive_details.id,
      market_value: extensive_details.quote.amount,
      quantity: quantity,
      order_type: "sell_quantity",
      order_sub_type: "market",
      time_in_force: "day",
      account_id: accountId,
    }, tokens);
  },

  /**
   * Limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  placeLimitSell: async (tokens, accountId, ticker, limit, quantity) =>
    handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "sell_quantity",
      order_sub_type: "limit",
      time_in_force: "day",
      account_id: accountId
    }, tokens),

  /**
   * Stop limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  placeStopLimitSell: async (tokens, accountId, ticker, stop, limit, quantity) => {

    let security = await wealthsimple.getSecurity(tokens, ticker);

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
    }, tokens);
  }
}

export default wealthsimple;
