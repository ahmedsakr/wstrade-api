'use strict';

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  login: login,
  getAccounts: getAccounts,
  getAccountData: getAccountData,
  getHistory: getHistory,
  getBankAccounts: getBankAccounts,
  getDeposits: getDeposits,
  getExchangeRates: getExchangeRates,
  getOrders: getOrders,
  getPendingOrdersFor: getPendingOrdersFor,
  cancelOrder: cancelOrder,
  cancelPendingOrders: cancelPendingOrders,
  getSecurityId: getSecurityId,
  placeLimitBuy: placeLimitBuy,
  placeLimitSell: placeLimitSell
};

var defaultEndpointBehaviour = {

  // Default failure method for all endpoint calls
  onFailure: async function onFailure(response) {
    return {
      status: response.status,
      reason: response.statusText,
      body: await response.json()
    };
  },

  // Default success method for all endpoint calls
  onSuccess: async function onSuccess(request) {
    return await request.response.json();
  }
};

var WealthSimpleTradeEndpoints = {

  /*
   * The LOGIN endpoint intializes a new session for the given email and
   * password set. If the login is successful, access and refresh tokens
   * are returned in the headers. The access token is the key for invoking
   * all other end points.
   */
  LOGIN: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/login",
    onSuccess: async function onSuccess(request) {
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
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();
      var ids = [];

      // Collect all account ids registered under this WealthSimple Trade Account
      data.results.map(function (account) {
        return ids.push(account.id);
      });

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
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All linked bank accounts under the WealthSimple Trade account
   */
  BANK_ACCOUNTS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/bank-accounts",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Current WealthSimple Trade USD/CAD exchange rates
   */
  EXCHANGE_RATES: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/forex",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Provides the WealthSimple Trade security id for the security represented
   * by the ticker.
   */
  SECURITY_ID: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/securities?query={0}",
    parameters: {
      0: "ticker"
    },
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();

      if (data.results.length === 0) {
        return Promise.reject({
          reason: 'Security does not exist'
        });
      }

      return data.results[0].id;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Pull all orders (filled, cancelled, pending) for the specified account under
   * the WealthSimple Trade account.
   */
  RETRIEVE_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?offset={0}",
    parameters: {
      0: "offset"
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Retrieves all pending orders for a specific security.
   */
  PENDING_ORDERS_FOR_TICKER: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders",
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();
      return data.results.filter(function (order) {
        return order.symbol === request.arguments.ticker && order.status === 'submitted';
      });
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
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Cancels all pending orders within the WealthSimple Trade account.
   */
  CANCEL_PENDING_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders",
    onSuccess: async function onSuccess(request, tokens) {
      var data = await request.response.json();

      // Iteratively execute the CANCEL_ORDER endpoint for each pending order
      var pendingOrders = data.results.filter(function (order) {
        return order.status === 'submitted';
      });
      pendingOrders.map(async function (order) {
        return await cancelOrder(tokens, order.order_id);
      });

      return {
        orders_cancelled: pendingOrders.length,
        ids: pendingOrders.map(function (order) {
          return order.order_id;
        })
      };
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

  // WealthSimple Trade API returns some custom HTTP codes
};var wealthSimpleHttpCodes = {
  ORDER_FILLED: 201

  // Successful HTTP codes to be used for determining the status of the request
};var httpSuccessCodes = [_httpStatus2.default.OK, wealthSimpleHttpCodes.ORDER_FILLED];

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data, and the authentication tokens.
 */
async function handleRequest(endpoint, data, tokens) {
  try {

    // Submit the HTTP request to the WealthSimple Trade Servers
    var response = await talk(endpoint, data, tokens);

    if (isSuccessfulRequest(response.status)) {
      return endpoint.onSuccess({
        arguments: data,
        response: response
      }, tokens);
    } else {
      return Promise.reject((await endpoint.onFailure(response)));
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
  var url = endpoint.url;
  for (var index = 0; index < Object.keys(endpoint.parameters).length; index++) {
    if (data[endpoint.parameters[index]] === null || data[endpoint.parameters[index]] === undefined) {
      throw new Error("URL Path parameter missing");
    }

    url = url.replace('{' + index + '}', data[endpoint.parameters[index]]);
    delete data[endpoint.parameters[index]];
  }

  return { url: url, payload: data };
}

/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */
function talk(endpoint, data, tokens) {
  var headers = new _nodeFetch2.default.Headers();
  headers.append('Content-Type', 'application/json');

  if (tokens) {
    headers.append('Authorization', '' + tokens.access);
  }

  // fill path and query parameters in the URL

  var _finalizeRequest = finalizeRequest(endpoint, data),
      url = _finalizeRequest.url,
      payload = _finalizeRequest.payload;

  return (0, _nodeFetch2.default)(url, {
    body: ['GET', 'DELETE'].includes(endpoint.method) ? undefined : JSON.stringify(payload),
    method: endpoint.method,
    headers: headers
  });
}

var isSuccessfulRequest = function isSuccessfulRequest(code) {
  return httpSuccessCodes.includes(code);
};

/**
 * Attempts to create a session for the provided email and password.
 *
 * @param {*} email emailed registered by the WealthSimple Trade account
 * @param {*} password The password of the account
 */
var login = async function login(email, password) {
  return handleRequest(WealthSimpleTradeEndpoints.LOGIN, { email: email, password: password });
};

/**
 * Retrieves all account ids open under this WealthSimple Trade account.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getAccounts = async function getAccounts(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.ACCOUNT_IDS, {}, tokens);
};

/**
 * Retrieves the top-level data of the account, including account id, account types, account values, and more.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getAccountData = async function getAccountData(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.LIST_ACCOUNT, {}, tokens);
};

/**
 * Query the history of the account within a certain time interval.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} interval The time interval for the history query
 * @param {*} accountId The account to query
 */
var getHistory = async function getHistory(tokens, interval, accountId) {
  return handleRequest(WealthSimpleTradeEndpoints.HISTORY_ACCOUNT, { interval: interval, accountId: accountId }, tokens);
};

/**
 * Retains all bank accounts linked to the WealthSimple Trade account.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getBankAccounts = async function getBankAccounts(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.BANK_ACCOUNTS, {}, tokens);
};

/**
 * Grab all deposit records on the WealthSimple Trade account.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getDeposits = async function getDeposits(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.DEPOSITS, {}, tokens);
};

/**
 * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
 * platform.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getExchangeRates = async function getExchangeRates(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.EXCHANGE_RATES, {}, tokens);
};

// The maximum number of orders retrieved by the /orders API.
var ORDERS_PER_PAGE = 20;

/**
 * Collects orders (filled, pending, cancelled) in pages of 20 orders.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var getOrders = async function getOrders(tokens, page) {
  return handleRequest(WealthSimpleTradeEndpoints.RETRIEVE_ORDERS, {
    offset: (page - 1) * ORDERS_PER_PAGE
  }, tokens);
};

/**
 * Retrieves pending orders for the specified security.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} ticker The security symbol
 */
var getPendingOrdersFor = async function getPendingOrdersFor(tokens, ticker) {
  return handleRequest(WealthSimpleTradeEndpoints.PENDING_ORDERS_FOR_TICKER, { ticker: ticker }, tokens);
};

/**
 * Cancels the pending order specified by the order id.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} orderId The pending order to cancel
 */
var cancelOrder = async function cancelOrder(tokens, orderId) {
  return handleRequest(WealthSimpleTradeEndpoints.CANCEL_ORDER, { orderId: orderId }, tokens);
};

/**
 * Cancels all pending orders under the WealthSimple Trade Account.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
var cancelPendingOrders = async function cancelPendingOrders(tokens) {
  return handleRequest(WealthSimpleTradeEndpoints.CANCEL_PENDING_ORDERS, {}, tokens);
};

/**
 * Discovers the WealthSimple Trade security id for the provided ticker.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} ticker The security symbol
 */
var getSecurityId = async function getSecurityId(tokens, ticker) {
  return handleRequest(WealthSimpleTradeEndpoints.SECURITY_ID, { ticker: ticker }, tokens);
};

/**
 * Limit buy a security through the WealthSimple Trade application.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} accountId The account to make the transaction from
 * @param {*} ticker The security symbol
 * @param {*} limit The maximum price to purchase the security at
 * @param {*} quantity The number of securities to purchase
 */
var placeLimitBuy = async function placeLimitBuy(tokens, accountId, ticker, limit, quantity) {
  return handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
    accountId: accountId,
    security_id: await getSecurityId(tokens, ticker),
    limit_price: limit,
    quantity: quantity,
    order_type: "buy_quantity",
    order_sub_type: "limit",
    time_in_force: "day"
  }, tokens);
};

/**
 * Limit sell a security through the WealthSimple Trade application.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 * @param {*} accountId The account to make the transaction from
 * @param {*} ticker The security symbol
 * @param {*} limit The minimum price to sell the security at
 * @param {*} quantity The number of securities to sell
 */
var placeLimitSell = async function placeLimitSell(tokens, accountId, ticker, limit, quantity) {
  return handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
    accountId: accountId,
    security_id: await getSecurityId(tokens, ticker),
    limit_price: limit,
    quantity: quantity,
    order_type: "sell_quantity",
    order_sub_type: "limit",
    time_in_force: "day"
  }, tokens);
};