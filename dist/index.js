"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _endpoints = _interopRequireWildcard(require("./api/endpoints"));

var _https = require("./network/https");

var _login = _interopRequireDefault(require("./auth/login"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Checks if a security trades on TSX or TSX-V
const isCanadianSecurity = exchange => ['TSX', 'TSX-V'].includes(exchange);

const wealthsimple = {
  auth: _login.default,

  /**
   * Appends a header name-value pair to all requests.
   * 
   * @param {*} name Header key
   * @param {*} value Header value
   */
  addHeader: (name, value) => _https.headers.add(name, value),

  /**
   * Removes a custom header from all requests.
   * 
   * @param {*} name Header key
   */
  removeHeader: name => _https.headers.remove(name),

  /**
   * Clears all custom headers.
   */
  clearHeaders: () => _https.headers.clear(),

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccounts: function () {
    var _getAccounts = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.ACCOUNT_IDS, {}, tokens);
    });

    function getAccounts(_x) {
      return _getAccounts.apply(this, arguments);
    }

    return getAccounts;
  }(),

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getAccountData: function () {
    var _getAccountData = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.LIST_ACCOUNT, {}, tokens);
    });

    function getAccountData(_x2) {
      return _getAccountData.apply(this, arguments);
    }

    return getAccountData;
  }(),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  getHistory: function () {
    var _getHistory = _asyncToGenerator(function* (tokens, interval, accountId) {
      return (0, _https.handleRequest)(_endpoints.default.HISTORY_ACCOUNT, {
        interval,
        accountId
      }, tokens);
    });

    function getHistory(_x3, _x4, _x5) {
      return _getHistory.apply(this, arguments);
    }

    return getHistory;
  }(),

  /**
   * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.ss
   */
  getActivities: function () {
    var _getActivities = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.ACTIVITIES, {}, tokens);
    });

    function getActivities(_x6) {
      return _getActivities.apply(this, arguments);
    }

    return getActivities;
  }(),

  /**
   * Retains all bank accounts linked to the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getBankAccounts: function () {
    var _getBankAccounts = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.BANK_ACCOUNTS, {}, tokens);
    });

    function getBankAccounts(_x7) {
      return _getBankAccounts.apply(this, arguments);
    }

    return getBankAccounts;
  }(),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getDeposits: function () {
    var _getDeposits = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.DEPOSITS, {}, tokens);
    });

    function getDeposits(_x8) {
      return _getDeposits.apply(this, arguments);
    }

    return getDeposits;
  }(),

  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  getExchangeRates: function () {
    var _getExchangeRates = _asyncToGenerator(function* (tokens) {
      return (0, _https.handleRequest)(_endpoints.default.EXCHANGE_RATES, {}, tokens);
    });

    function getExchangeRates(_x9) {
      return _getExchangeRates.apply(this, arguments);
    }

    return getExchangeRates;
  }(),

  /**
   * Lists all positions in the specified trading account under the WealthSimple Trade Account.
   * 
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getPositions: function () {
    var _getPositions = _asyncToGenerator(function* (tokens, accountId) {
      return (0, _https.handleRequest)(_endpoints.default.POSITIONS, {
        accountId
      }, tokens);
    });

    function getPositions(_x10, _x11) {
      return _getPositions.apply(this, arguments);
    }

    return getPositions;
  }(),

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} page The orders page index to seek to
   */
  getOrdersByPage: function () {
    var _getOrdersByPage = _asyncToGenerator(function* (tokens, accountId, page) {
      return (0, _https.handleRequest)(_endpoints.default.ORDERS_BY_PAGE, {
        offset: (page - 1) * _endpoints.ORDERS_PER_PAGE,
        accountId
      }, tokens);
    });

    function getOrdersByPage(_x12, _x13, _x14) {
      return _getOrdersByPage.apply(this, arguments);
    }

    return getOrdersByPage;
  }(),

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  getOrders: function () {
    var _getOrders = _asyncToGenerator(function* (tokens, accountId) {
      return (0, _https.handleRequest)(_endpoints.default.ALL_ORDERS, {
        offset: 0,
        accountId
      }, tokens);
    });

    function getOrders(_x15, _x16) {
      return _getOrders.apply(this, arguments);
    }

    return getOrders;
  }(),

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getPendingOrders: function () {
    var _getPendingOrders = _asyncToGenerator(function* (tokens, accountId, ticker) {
      return (0, _https.handleRequest)(_endpoints.default.FILTERED_ORDERS, {
        accountId,
        ticker,
        status: 'submitted'
      }, tokens);
    });

    function getPendingOrders(_x17, _x18, _x19) {
      return _getPendingOrders.apply(this, arguments);
    }

    return getPendingOrders;
  }(),

  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getFilledOrders: function () {
    var _getFilledOrders = _asyncToGenerator(function* (tokens, accountId, ticker) {
      return (0, _https.handleRequest)(_endpoints.default.FILTERED_ORDERS, {
        accountId,
        ticker,
        status: 'posted'
      }, tokens);
    });

    function getFilledOrders(_x20, _x21, _x22) {
      return _getFilledOrders.apply(this, arguments);
    }

    return getFilledOrders;
  }(),

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  getCancelledOrders: function () {
    var _getCancelledOrders = _asyncToGenerator(function* (tokens, accountId, ticker) {
      return (0, _https.handleRequest)(_endpoints.default.FILTERED_ORDERS, {
        accountId,
        ticker,
        status: 'cancelled'
      }, tokens);
    });

    function getCancelledOrders(_x23, _x24, _x25) {
      return _getCancelledOrders.apply(this, arguments);
    }

    return getCancelledOrders;
  }(),

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} orderId The pending order to cancel
   */
  cancelOrder: function () {
    var _cancelOrder = _asyncToGenerator(function* (tokens, orderId) {
      return (0, _https.handleRequest)(_endpoints.default.CANCEL_ORDER, {
        orderId
      }, tokens);
    });

    function cancelOrder(_x26, _x27) {
      return _cancelOrder.apply(this, arguments);
    }

    return cancelOrder;
  }(),

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  cancelPendingOrders: function () {
    var _cancelPendingOrders = _asyncToGenerator(function* (tokens, accountId) {
      const pending = yield wealthsimple.getPendingOrders(tokens, accountId);
      return Promise.all(pending.orders.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (order) {
          return yield wealthsimple.cancelOrder(tokens, order.order_id);
        });

        return function (_x30) {
          return _ref.apply(this, arguments);
        };
      }()));
    });

    function cancelPendingOrders(_x28, _x29) {
      return _cancelPendingOrders.apply(this, arguments);
    }

    return cancelPendingOrders;
  }(),

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
  getSecurity: function () {
    var _getSecurity = _asyncToGenerator(function* (tokens, ticker, extensive) {
      if (typeof ticker === 'string') {
        ticker = {
          symbol: ticker
        };
        let tickerParts = ticker.symbol.split(':');

        if (tickerParts.length > 2) {
          return Promise.reject({
            reason: `Illegal ticker: ${ticker.symbol}`
          });
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
        return yield (0, _https.handleRequest)(_endpoints.default.EXTENSIVE_SECURITY_DETAILS, {
          id: ticker.id
        }, tokens);
      }

      let queryResult = yield (0, _https.handleRequest)(_endpoints.default.SECURITY, {
        ticker: ticker.symbol
      }, tokens);
      queryResult = queryResult.filter(security => security.stock.symbol === ticker.symbol);

      if (ticker.exchange) {
        queryResult = queryResult.filter(security => security.stock.primary_exchange === ticker.exchange);
      }

      if (queryResult.length > 1) {
        return Promise.reject({
          reason: 'Multiple securities matched query.'
        });
      } else if (queryResult.length === 0) {
        return Promise.reject({
          reason: 'No securities matched query.'
        });
      }

      if (extensive) {
        // The caller has opted to receive the extensive details about the security.
        return yield (0, _https.handleRequest)(_endpoints.default.EXTENSIVE_SECURITY_DETAILS, {
          id: queryResult[0].id
        }, tokens);
      }

      return queryResult[0];
    });

    function getSecurity(_x31, _x32, _x33) {
      return _getSecurity.apply(this, arguments);
    }

    return getSecurity;
  }(),

  /**
   * Market buy a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketBuy: function () {
    var _placeMarketBuy = _asyncToGenerator(function* (tokens, accountId, ticker, quantity) {
      let extensive_details = yield wealthsimple.getSecurity(tokens, ticker, true);
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: extensive_details.id,
        limit_price: extensive_details.quote.amount,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "market",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeMarketBuy(_x34, _x35, _x36, _x37) {
      return _placeMarketBuy.apply(this, arguments);
    }

    return placeMarketBuy;
  }(),

  /**
   * Limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  placeLimitBuy: function () {
    var _placeLimitBuy = _asyncToGenerator(function* (tokens, accountId, ticker, limit, quantity) {
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(tokens, ticker)).id,
        limit_price: limit,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "limit",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeLimitBuy(_x38, _x39, _x40, _x41, _x42) {
      return _placeLimitBuy.apply(this, arguments);
    }

    return placeLimitBuy;
  }(),

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
  placeStopLimitBuy: function () {
    var _placeStopLimitBuy = _asyncToGenerator(function* (tokens, accountId, ticker, stop, limit, quantity) {
      let security = yield wealthsimple.getSecurity(tokens, ticker); // The WealthSimple Trade backend doesn't check for this, even though the app does..

      if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
        return Promise.reject({
          reason: "TSX/TSX-V securities must have an equivalent stop and limit price."
        });
      }

      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(tokens, ticker)).id,
        stop_price: stop,
        limit_price: limit,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "stop_limit",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeStopLimitBuy(_x43, _x44, _x45, _x46, _x47, _x48) {
      return _placeStopLimitBuy.apply(this, arguments);
    }

    return placeStopLimitBuy;
  }(),

  /**
   * Market sell a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  placeMarketSell: function () {
    var _placeMarketSell = _asyncToGenerator(function* (tokens, accountId, ticker, quantity) {
      let extensive_details = yield wealthsimple.getSecurity(tokens, ticker, true);
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: extensive_details.id,
        market_value: extensive_details.quote.amount,
        quantity: quantity,
        order_type: "sell_quantity",
        order_sub_type: "market",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeMarketSell(_x49, _x50, _x51, _x52) {
      return _placeMarketSell.apply(this, arguments);
    }

    return placeMarketSell;
  }(),

  /**
   * Limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  placeLimitSell: function () {
    var _placeLimitSell = _asyncToGenerator(function* (tokens, accountId, ticker, limit, quantity) {
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(tokens, ticker)).id,
        limit_price: limit,
        quantity,
        order_type: "sell_quantity",
        order_sub_type: "limit",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeLimitSell(_x53, _x54, _x55, _x56, _x57) {
      return _placeLimitSell.apply(this, arguments);
    }

    return placeLimitSell;
  }(),

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
  placeStopLimitSell: function () {
    var _placeStopLimitSell = _asyncToGenerator(function* (tokens, accountId, ticker, stop, limit, quantity) {
      let security = yield wealthsimple.getSecurity(tokens, ticker); // The WealthSimple Trade backend doesn't check for this, even though the app does..

      if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
        return Promise.reject({
          reason: "TSX/TSX-V securities must have an equivalent stop and limit price."
        });
      }

      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: security.id,
        stop_price: stop,
        limit_price: limit,
        quantity,
        order_type: "sell_quantity",
        order_sub_type: "stop_limit",
        time_in_force: "day",
        account_id: accountId
      }, tokens);
    });

    function placeStopLimitSell(_x58, _x59, _x60, _x61, _x62, _x63) {
      return _placeStopLimitSell.apply(this, arguments);
    }

    return placeStopLimitSell;
  }()
};
var _default = wealthsimple;
exports.default = _default;