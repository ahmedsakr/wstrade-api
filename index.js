'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _endpoints = require('./endpoints');

var _endpoints2 = _interopRequireDefault(_endpoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var customHeaders = new _nodeFetch2.default.Headers();

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data, and the authentication tokens.
 */
async function handleRequest(endpoint, data, tokens) {
  try {

    // Submit the HTTP request to the WealthSimple Trade Servers
    var response = await talk(endpoint, data, tokens);

    if ((0, _endpoints.isSuccessfulRequest)(response.status)) {
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
  Object.assign(headers, customHeaders);

  headers.append('Content-Type', 'application/json');

  if (tokens) {
    headers.append('Authorization', '' + tokens.access);
  }

  // Make a copy of the arguments so the original copy is not modified
  var copy = {};
  Object.assign(copy, data);

  // fill path and query parameters in the URL

  var _finalizeRequest = finalizeRequest(endpoint, copy),
      url = _finalizeRequest.url,
      payload = _finalizeRequest.payload;

  return (0, _nodeFetch2.default)(url, {
    body: ['GET', 'DELETE'].includes(endpoint.method) ? undefined : JSON.stringify(payload),
    method: endpoint.method,
    headers: headers
  });
}

var wealthsimple = {

  /**
   * Attempts to create a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   */
  login: async function login(email, password) {
    return handleRequest(_endpoints2.default.LOGIN, { email: email, password: password });
  },

  /**
   * Generates a new set of access and refresh tokens.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  refresh: async function refresh(tokens) {
    return handleRequest(_endpoints2.default.REFRESH, { refresh_token: tokens.refresh }, tokens);
  },

  /**
   * Appends a header name-value pair to all requests.
   * 
   * @param {*} name Header key
   * @param {*} value Header value
   */
  addHeader: function addHeader(name, value) {
    return customHeaders.append(name, value);
  },

  /**
   * Removes a custom header from all requests.
   * 
   * @param {*} name Header key
   */
  removeHeader: function removeHeader(name) {
    return customHeaders.delete(name);
  },

  /**
   * Clears all custom headers.
   */
  clearHeaders: function clearHeaders() {
    return [].concat(_toConsumableArray(customHeaders)).forEach(function (header) {
      return customHeaders.delete(header[0]);
    });
  },

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccounts: async function getAccounts(tokens) {
    return handleRequest(_endpoints2.default.ACCOUNT_IDS, {}, tokens);
  },

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccountData: async function getAccountData(tokens) {
    return handleRequest(_endpoints2.default.LIST_ACCOUNT, {}, tokens);
  },

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: async function getHistory(tokens, interval, accountId) {
    return handleRequest(_endpoints2.default.HISTORY_ACCOUNT, { interval: interval, accountId: accountId }, tokens);
  },

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getBankAccounts: async function getBankAccounts(tokens) {
    return handleRequest(_endpoints2.default.BANK_ACCOUNTS, {}, tokens);
  },

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getDeposits: async function getDeposits(tokens) {
    return handleRequest(_endpoints2.default.DEPOSITS, {}, tokens);
  },

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getExchangeRates: async function getExchangeRates(tokens) {
    return handleRequest(_endpoints2.default.EXCHANGE_RATES, {}, tokens);
  },

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   */
  getOrdersByPage: async function getOrdersByPage(tokens, accountId, page) {
    return handleRequest(_endpoints2.default.ORDERS_BY_PAGE, {
      offset: (page - 1) * _endpoints.ORDERS_PER_PAGE,
      accountId: accountId
    }, tokens);
  },

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getOrders: async function getOrders(tokens, accountId) {
    return handleRequest(_endpoints2.default.ALL_ORDERS, {
      offset: 0,
      accountId: accountId
    }, tokens);
  },

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getPendingOrders: async function getPendingOrders(tokens, accountId, ticker) {
    return handleRequest(_endpoints2.default.FILTERED_ORDERS, {
      accountId: accountId,
      ticker: ticker,
      status: 'submitted'
    }, tokens);
  },

  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getFilledOrders: async function getFilledOrders(tokens, accountId, ticker) {
    return handleRequest(_endpoints2.default.FILTERED_ORDERS, {
      accountId: accountId,
      ticker: ticker,
      status: 'posted'
    }, tokens);
  },

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getCancelledOrders: async function getCancelledOrders(tokens, accountId, ticker) {
    return handleRequest(_endpoints2.default.FILTERED_ORDERS, {
      accountId: accountId,
      ticker: ticker,
      status: 'cancelled'
    }, tokens);
  },

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} orderId The pending order to cancel
   */
  cancelOrder: async function cancelOrder(tokens, orderId) {
    return handleRequest(_endpoints2.default.CANCEL_ORDER, { orderId: orderId }, tokens);
  },

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  cancelPendingOrders: async function cancelPendingOrders(tokens, accountId) {
    var pending = await wealthsimple.getPendingOrders(tokens, accountId);
    return Promise.all(pending.orders.map(async function (order) {
      return await wealthsimple.cancelOrder(tokens, order.order_id);
    }));
  },

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} ticker The security symbol
   */
  getSecurity: async function getSecurity(tokens, ticker) {
    return handleRequest(_endpoints2.default.SECURITY, { ticker: ticker }, tokens);
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
  placeLimitBuy: async function placeLimitBuy(tokens, accountId, ticker, limit, quantity) {
    return handleRequest(_endpoints2.default.PLACE_ORDER, {
      accountId: accountId,
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity: quantity,
      order_type: "buy_quantity",
      order_sub_type: "limit",
      time_in_force: "day"
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
  placeLimitSell: async function placeLimitSell(tokens, accountId, ticker, limit, quantity) {
    return handleRequest(_endpoints2.default.PLACE_ORDER, {
      accountId: accountId,
      security_id: (await wealthsimple.getSecurity(tokens, ticker)).id,
      limit_price: limit,
      quantity: quantity,
      order_type: "sell_quantity",
      order_sub_type: "limit",
      time_in_force: "day"
    }, tokens);
  }
};

exports.default = wealthsimple;