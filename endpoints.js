'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSuccessfulRequest = exports.ORDERS_PER_PAGE = undefined;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// The maximum number of orders retrieved by the /orders API.
var ORDERS_PER_PAGE = exports.ORDERS_PER_PAGE = 20;

// WealthSimple Trade API returns some custom HTTP codes
var wealthSimpleHttpCodes = {
  ORDER_CREATED: 201

  // Successful HTTP codes to be used for determining the status of the request
};var httpSuccessCodes = [_httpStatus2.default.OK, wealthSimpleHttpCodes.ORDER_CREATED];

var isSuccessfulRequest = exports.isSuccessfulRequest = function isSuccessfulRequest(code) {
  return httpSuccessCodes.includes(code);
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
   * Generates a new set of access and refresh tokens.
   */
  REFRESH: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/refresh",
    onSuccess: async function onSuccess(request) {
      return {
        access: request.response.headers.get('x-access-token'),
        refresh: request.response.headers.get('x-refresh-token')
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
          var tmp = await _index2.default.getOrdersByPage(tokens, request.arguments.accountId, page);
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
          var tmp = await _index2.default.getOrdersByPage(tokens, request.arguments.accountId, page);
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
};

exports.default = WealthSimpleTradeEndpoints;