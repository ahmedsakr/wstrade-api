'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

      // Collect all account ids registered under this WealthSimple Trade Account
      return data.results.map(function (account) {
        return account.id;
      });
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
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();
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
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();
      return data.results;
    },
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
   * Grabs information about the security resembled by the ticker.
   */
  SECURITY: {
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
      1: "accountId"
    },
    onSuccess: async function onSuccess(request) {
      var data = await request.response.json();
      return {
        total: data.total,
        orders: data.results
      };
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
      0: "accountId"
    },
    onSuccess: async function onSuccess(request, tokens) {
      var data = await request.response.json();
      var pages = Math.ceil(data.total / ORDERS_PER_PAGE);
      var orders = data.results;

      if (pages > 1) {

        // Query the rest of the pages
        for (var page = 2; page <= pages; page++) {
          var tmp = await wealthsimple.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push.apply(orders, _toConsumableArray(tmp.orders));
        }
      }

      return {
        total: orders.length,
        orders: orders
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
    onSuccess: async function onSuccess(request, tokens) {
      var data = await request.response.json();
      var pages = Math.ceil(data.total / ORDERS_PER_PAGE);

      // The ticker symbol restricts the pending orders to a specific security
      var pendingFilter = request.arguments.ticker ? function (order) {
        return order.symbol === request.arguments.ticker && order.status === request.arguments.status;
      } : function (order) {
        return order.status === request.arguments.status;
      };

      var orders = data.results.filter(pendingFilter);
      if (pages > 1) {

        // Check all other pages for pending orders
        for (var page = 2; page <= pages; page++) {
          var tmp = await wealthsimple.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push.apply(orders, _toConsumableArray(tmp.orders.filter(pendingFilter)));
        }
      }

      return {
        total: orders.length,
        orders: orders
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
    onSuccess: async function onSuccess(request) {
      return {
        order: request.arguments.orderId,
        response: await request.response.json()
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

  // The maximum number of orders retrieved by the /orders API.
};var ORDERS_PER_PAGE = 20;
var isSuccessfulRequest = function isSuccessfulRequest(code) {
  return httpSuccessCodes.includes(code);
};

// WealthSimple Trade API returns some custom HTTP codes
var wealthSimpleHttpCodes = {
  ORDER_CREATED: 201

  // Successful HTTP codes to be used for determining the status of the request
};var httpSuccessCodes = [_httpStatus2.default.OK, wealthSimpleHttpCodes.ORDER_CREATED];

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
    return handleRequest(WealthSimpleTradeEndpoints.LOGIN, { email: email, password: password });
  },

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccounts: async function getAccounts(tokens) {
    return handleRequest(WealthSimpleTradeEndpoints.ACCOUNT_IDS, {}, tokens);
  },

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccountData: async function getAccountData(tokens) {
    return handleRequest(WealthSimpleTradeEndpoints.LIST_ACCOUNT, {}, tokens);
  },

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: async function getHistory(tokens, interval, accountId) {
    return handleRequest(WealthSimpleTradeEndpoints.HISTORY_ACCOUNT, { interval: interval, accountId: accountId }, tokens);
  },

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getBankAccounts: async function getBankAccounts(tokens) {
    return handleRequest(WealthSimpleTradeEndpoints.BANK_ACCOUNTS, {}, tokens);
  },

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getDeposits: async function getDeposits(tokens) {
    return handleRequest(WealthSimpleTradeEndpoints.DEPOSITS, {}, tokens);
  },

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getExchangeRates: async function getExchangeRates(tokens) {
    return handleRequest(WealthSimpleTradeEndpoints.EXCHANGE_RATES, {}, tokens);
  },

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   */
  getOrdersByPage: async function getOrdersByPage(tokens, accountId, page) {
    return handleRequest(WealthSimpleTradeEndpoints.ORDERS_BY_PAGE, {
      offset: (page - 1) * ORDERS_PER_PAGE,
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
    return handleRequest(WealthSimpleTradeEndpoints.ALL_ORDERS, {
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
    return handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    return handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    return handleRequest(WealthSimpleTradeEndpoints.FILTERED_ORDERS, {
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
    return handleRequest(WealthSimpleTradeEndpoints.CANCEL_ORDER, { orderId: orderId }, tokens);
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
    return handleRequest(WealthSimpleTradeEndpoints.SECURITY, { ticker: ticker }, tokens);
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
    return handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
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
    return handleRequest(WealthSimpleTradeEndpoints.PLACE_ORDER, {
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