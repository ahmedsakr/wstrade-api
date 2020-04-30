import fetch from 'node-fetch';
import status from 'http-status';

const defaultEndpointBehaviour = {

  // Default failure method for all endpoint calls
  onFailure: async (response) => {
    return {
      status: response.status,
      reason: response.statusText,
      body: await response.json()
    }
  },

  // Default success method for all endpoint calls
  onSuccess: async (request) => await request.response.json()
}

const WealthSimpleTradeEndpoints = {

  /*
   * The LOGIN endpoint intializes a new session for the given email and
   * password set. If the login is successful, access and refresh tokens
   * are returned in the headers. The access token is the key for invoking
   * all other end points.
   */
  LOGIN: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/login",
    onSuccess: async (request) => {
      return {
        tokens: {
          access: request.response.headers.get('x-access-token'),
          refresh: request.response.headers.get('x-refresh-token')
        },

        accountInfo: await request.response.json()
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grabs all account ids in this WealthSimple Trade account.
   */
  ACCOUNT_IDS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: async (request) => {
      const data = await request.response.json();
      let ids = []

      // Collect all account ids registered under this WealthSimple Trade Account
      data.results.map(account => ids.push(account.id));

      return ids;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * The LIST_ACCOUNT endpoint retrieves general metadata of the
   * WealthSimple Trade account, including balances, account id, and
   * more.
   */
  LIST_ACCOUNT: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * The HISTORY_ACCOUNT endpoint provides historical snapshots of the
   * WealthSimple account for a specified timeframe.
   */
  HISTORY_ACCOUNT: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/history/{0}?account_id={1}",
    parameters: {
      0: "interval",
      1: "accountId"
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All deposits under the WealthSimple Trade account
   */
  DEPOSITS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/deposits",
    onSuccess: async (request) => {
      const data = await request.response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All linked bank accounts under the WealthSimple Trade account
   */
  BANK_ACCOUNTS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/bank-accounts",
    onSuccess: async (request) => {
      const data = await request.response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Current WealthSimple Trade USD/CAD exchange rates
   */
  EXCHANGE_RATES : {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/forex",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grabs information about the security resembled by the ticker.
   */
  SECURITY: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/securities?query={0}",
    parameters: {
      0: "ticker"
    },
    onSuccess: async (request) => {
      let data = await request.response.json();

      if (data.results.length === 0) {
        return Promise.reject({
          reason: `Security does not exist`
        });
      }

      return data.results[0];
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grab a page of orders (20 orders).
   */
  ORDERS_BY_PAGE: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?offset={0}&account_id={1}",
    parameters: {
      0: "offset",
      1: "accountId",
    },
    onSuccess: async (request) => {
      const data = await request.response.json();
      return {
        total: data.total,
        orders: data.results
      }
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Pull all orders (filled, cancelled, pending) for the specified account under
   * the WealthSimple Trade account.
   */
  ALL_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId",
    },
    onSuccess: async (request, tokens) => {
      const data = await request.response.json();
      const pages = Math.ceil(data.total / ORDERS_PER_PAGE);
      let orders = data.results;

      if (pages > 1) {

        // Query the rest of the pages
        for (let page = 2; page <= pages; page++) {
          let tmp = await wealthsimple.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push(...tmp.orders)
        }
      }

      return {
        total: orders.length,
        orders
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Filters orders by status and ticker.
   */
  FILTERED_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId"
    },
    onSuccess: async (request, tokens) => {
      const data = await request.response.json();
      const pages = Math.ceil(data.total / ORDERS_PER_PAGE);

      // The ticker symbol restricts the pending orders to a specific security
      let pendingFilter = (request.arguments.ticker) ?
                          order => order.symbol === request.arguments.ticker && order.status === request.arguments.status:
                          order => order.status === request.arguments.status;

      let orders = data.results.filter(pendingFilter);
      if (pages > 1) {

        // Check all other pages for pending orders
        for (let page = 2; page <= pages; page++) {
          let tmp = await wealthsimple.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push(...tmp.orders.filter(pendingFilter))
        }
      }

      return {
        total: orders.length,
        orders
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Cancels a specific order by its id.
   */
  CANCEL_ORDER: {
    method: "DELETE",
    url: "https://trade-service.wealthsimple.com/orders/{0}",
    parameters: {
      0: "orderId"
    },
    onSuccess: async (request) => {
      let data = await request.response.json();

      return {
        order: request.arguments.orderId,
        response: data
      }
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Places an order for a security.
   */
  PLACE_ORDER: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId"
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  }
}

// WealthSimple Trade API returns some custom HTTP codes
const wealthSimpleHttpCodes = {
  ORDER_FILLED: 201
}

// Successful HTTP codes to be used for determining the status of the request
const httpSuccessCodes = [
  status.OK,
  wealthSimpleHttpCodes.ORDER_FILLED
]

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

  if (tokens) {
    headers.append('Authorization', `${tokens.access}`)
  }

  // Make a copy of the arguments so the original copy is not modified
  let copy = {}
  Object.assign(copy, data);

  // fill path and query parameters in the URL
  let { url, payload } = finalizeRequest(endpoint, copy);

  return fetch(url, {
    body: ['GET', 'DELETE'].includes(endpoint.method) ? undefined : JSON.stringify(payload),
    method: endpoint.method,
    headers: headers
  })
}

const isSuccessfulRequest = (code) => httpSuccessCodes.includes(code);

// The maximum number of orders retrieved by the /orders API.
const  ORDERS_PER_PAGE = 20;

const wealthsimple = {
    
  /**
   * Attempts to create a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   */
  login: async (email, password) =>
    handleRequest(WealthSimpleTradeEndpoints.LOGIN, { email, password }),

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccounts: async (tokens) =>
    handleRequest(WealthSimpleTradeEndpoints.ACCOUNT_IDS, {}, tokens),

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccountData: async (tokens) =>
    handleRequest(WealthSimpleTradeEndpoints.LIST_ACCOUNT, {}, tokens),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: async (tokens, interval, accountId) =>
    handleRequest(WealthSimpleTradeEndpoints.HISTORY_ACCOUNT, { interval, accountId }, tokens),

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getBankAccounts: async (tokens) =>
    handleRequest(WealthSimpleTradeEndpoints.BANK_ACCOUNTS, {}, tokens),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getDeposits: async (tokens) =>
    handleRequest(WealthSimpleTradeEndpoints.DEPOSITS, {}, tokens),

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getExchangeRates: async (tokens) =>
    handleRequest(WealthSimpleTradeEndpoints.EXCHANGE_RATES, {}, tokens),

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   */
  getOrdersByPage: async (tokens, accountId, page) =>
    handleRequest(WealthSimpleTradeEndpoints.ORDERS_BY_PAGE, {
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
    handleRequest(WealthSimpleTradeEndpoints.ALL_ORDERS, {
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
    handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    handleRequest(WealthSimpleTradeEndpoints.CANCEL_ORDER, { orderId }, tokens),

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
   * @param {*} ticker The security symbol
   */
  getSecurity: async (tokens, ticker) =>
    handleRequest(WealthSimpleTradeEndpoints.SECURITY, { ticker }, tokens),

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
    handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
      accountId,
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "buy_quantity",
      order_sub_type: "limit",
      time_in_force: "day"
    }, tokens),

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
    handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
      accountId,
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity,
      order_type: "sell_quantity",
      order_sub_type: "limit",
      time_in_force: "day"
    }, tokens)
}

export default wealthsimple;