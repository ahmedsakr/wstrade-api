"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ORDERS_PER_PAGE = void 0;

var _ticker = _interopRequireDefault(require("../core/ticker"));

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// The maximum number of orders retrieved by the /orders API.
const ORDERS_PER_PAGE = 20;
exports.ORDERS_PER_PAGE = ORDERS_PER_PAGE;
const defaultEndpointBehaviour = {
  // Default failure method for all endpoint calls
  onFailure: function () {
    var _onFailure = _asyncToGenerator(function* (response) {
      return {
        status: response.status,
        reason: response.statusText,
        body: yield response.json()
      };
    });

    function onFailure(_x) {
      return _onFailure.apply(this, arguments);
    }

    return onFailure;
  }(),
  // Default success method for all endpoint calls
  onSuccess: function () {
    var _onSuccess = _asyncToGenerator(function* (request) {
      return yield request.response.json();
    });

    function onSuccess(_x2) {
      return _onSuccess.apply(this, arguments);
    }

    return onSuccess;
  }()
};
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
    onSuccess: function () {
      var _onSuccess2 = _asyncToGenerator(function* (request) {
        return {
          tokens: {
            access: request.response.headers.get('x-access-token'),
            refresh: request.response.headers.get('x-refresh-token')
          },
          accountInfo: yield request.response.json()
        };
      });

      function onSuccess(_x3) {
        return _onSuccess2.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Generates a new set of access and refresh tokens.
   */
  REFRESH: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/refresh",
    onSuccess: function () {
      var _onSuccess3 = _asyncToGenerator(function* (request) {
        return {
          access: request.response.headers.get('x-access-token'),
          refresh: request.response.headers.get('x-refresh-token')
        };
      });

      function onSuccess(_x4) {
        return _onSuccess3.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grabs all account ids in this WealthSimple Trade account.
   */
  ACCOUNT_IDS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: function () {
      var _onSuccess4 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json(); // Collect all account ids registered under this WealthSimple Trade Account

        return data.results.map(account => account.id);
      });

      function onSuccess(_x5) {
        return _onSuccess4.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
   * Provides the most recent 20 activities (deposits, dividends, orders, etc) on the WealthSimple
   * Trade account.
   */
  ACTIVITIES: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/activities",
    onSuccess: function () {
      var _onSuccess5 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        return data.results;
      });

      function onSuccess(_x6) {
        return _onSuccess5.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All deposits under the WealthSimple Trade account
   */
  DEPOSITS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/deposits",
    onSuccess: function () {
      var _onSuccess6 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        return data.results;
      });

      function onSuccess(_x7) {
        return _onSuccess6.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All linked bank accounts under the WealthSimple Trade account
   */
  BANK_ACCOUNTS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/bank-accounts",
    onSuccess: function () {
      var _onSuccess7 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        return data.results;
      });

      function onSuccess(_x8) {
        return _onSuccess7.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
    onSuccess: function () {
      var _onSuccess8 = _asyncToGenerator(function* (request) {
        let data = yield request.response.json();

        if (data.results.length === 0) {
          return Promise.reject({
            reason: `Security does not exist`
          });
        }

        return data.results;
      });

      function onSuccess(_x9) {
        return _onSuccess8.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Fetches detailed information about a security using its unique
   * security identifier. Market quote, bid and ask size, and other information
   * are returned.
   */
  EXTENSIVE_SECURITY_DETAILS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/securities/{0}",
    parameters: {
      0: "id"
    },
    onSuccess: function () {
      var _onSuccess9 = _asyncToGenerator(function* (request) {
        return yield request.response.json();
      });

      function onSuccess(_x10) {
        return _onSuccess9.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Lists all positions under a trading account.
   */
  POSITIONS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/positions?account_id={0}",
    parameters: {
      0: "accountId"
    },
    onSuccess: function () {
      var _onSuccess10 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        return data.results;
      });

      function onSuccess(_x11) {
        return _onSuccess10.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
    onSuccess: function () {
      var _onSuccess11 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        return {
          total: data.total,
          orders: data.results
        };
      });

      function onSuccess(_x12) {
        return _onSuccess11.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
    onSuccess: function () {
      var _onSuccess12 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        const pages = Math.ceil(data.total / ORDERS_PER_PAGE);
        let orders = data.results;

        if (pages > 1) {
          // Query the rest of the pages
          for (let page = 2; page <= pages; page++) {
            let tmp = yield _index.default.orders.page(request.arguments.accountId, page);
            orders.push(...tmp.orders);
          }
        }

        return {
          total: orders.length,
          orders
        };
      });

      function onSuccess(_x13) {
        return _onSuccess12.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
    onSuccess: function () {
      var _onSuccess13 = _asyncToGenerator(function* (request) {
        const data = yield request.response.json();
        const pages = Math.ceil(data.total / ORDERS_PER_PAGE);

        let pendingFilter = order => {
          let ticker = request.arguments.ticker;

          if (ticker) {
            let target = new _ticker.default({
              symbol: order.symbol,
              id: order.security_id
            }); // order objects don't include exchanges, so we are unable to make
            // a strong comparison without requiring a linear increase of
            // endpoint calls (which is not reasonable).
            //
            // The user should provide the security id for a strong comparison here.

            if (!ticker.weakEquals(target)) {
              return false;
            }
          }

          return order.status === request.arguments.status;
        };

        let orders = data.results.filter(pendingFilter);

        if (pages > 1) {
          // Check all other pages for pending orders
          for (let page = 2; page <= pages; page++) {
            let tmp = yield _index.default.orders.page(request.arguments.accountId, page);
            orders.push(...tmp.orders.filter(pendingFilter));
          }
        }

        return {
          total: orders.length,
          orders
        };
      });

      function onSuccess(_x14) {
        return _onSuccess13.apply(this, arguments);
      }

      return onSuccess;
    }(),
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
    onSuccess: function () {
      var _onSuccess14 = _asyncToGenerator(function* (request) {
        return {
          order: request.arguments.orderId,
          response: yield request.response.json()
        };
      });

      function onSuccess(_x15) {
        return _onSuccess14.apply(this, arguments);
      }

      return onSuccess;
    }(),
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Places an order for a security.
   */
  PLACE_ORDER: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/orders",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  }
};
var _default = WealthSimpleTradeEndpoints;
exports.default = _default;