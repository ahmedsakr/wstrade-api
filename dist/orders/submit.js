"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _endpoints = _interopRequireDefault(require("../api/endpoints"));

var _https = require("../network/https");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} orderId The pending order to cancel
   */
  cancel: function () {
    var _cancel = _asyncToGenerator(function* (orderId) {
      return (0, _https.handleRequest)(_endpoints.default.CANCEL_ORDER, {
        orderId
      });
    });

    function cancel(_x) {
      return _cancel.apply(this, arguments);
    }

    return cancel;
  }(),

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  cancelPending: function () {
    var _cancelPending = _asyncToGenerator(function* (accountId) {
      const pending = yield wealthsimple.getPendingOrders(accountId);
      return Promise.all(pending.orders.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (order) {
          return yield wealthsimple.cancelOrder(order.order_id);
        });

        return function (_x3) {
          return _ref.apply(this, arguments);
        };
      }()));
    });

    function cancelPending(_x2) {
      return _cancelPending.apply(this, arguments);
    }

    return cancelPending;
  }(),

  /**
   * Market buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  marketBuy: function () {
    var _marketBuy = _asyncToGenerator(function* (accountId, ticker, quantity) {
      let extensive_details = yield wealthsimple.getSecurity(ticker, true);
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: extensive_details.id,
        limit_price: extensive_details.quote.amount,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "market",
        time_in_force: "day",
        account_id: accountId
      });
    });

    function marketBuy(_x4, _x5, _x6) {
      return _marketBuy.apply(this, arguments);
    }

    return marketBuy;
  }(),

  /**
   * Limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  limitBuy: function () {
    var _limitBuy = _asyncToGenerator(function* (accountId, ticker, limit, quantity) {
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(ticker)).id,
        limit_price: limit,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "limit",
        time_in_force: "day",
        account_id: accountId
      });
    });

    function limitBuy(_x7, _x8, _x9, _x10) {
      return _limitBuy.apply(this, arguments);
    }

    return limitBuy;
  }(),

  /**
   * Stop limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  stopLimitBuy: function () {
    var _stopLimitBuy = _asyncToGenerator(function* (accountId, ticker, stop, limit, quantity) {
      let security = yield wealthsimple.getSecurity(ticker); // The WealthSimple Trade backend doesn't check for this, even though the app does..

      if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
        return Promise.reject({
          reason: "TSX/TSX-V securities must have an equivalent stop and limit price."
        });
      }

      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(ticker)).id,
        stop_price: stop,
        limit_price: limit,
        quantity,
        order_type: "buy_quantity",
        order_sub_type: "stop_limit",
        time_in_force: "day",
        account_id: accountId
      });
    });

    function stopLimitBuy(_x11, _x12, _x13, _x14, _x15) {
      return _stopLimitBuy.apply(this, arguments);
    }

    return stopLimitBuy;
  }(),

  /**
   * Market sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  marketSell: function () {
    var _marketSell = _asyncToGenerator(function* (accountId, ticker, quantity) {
      let extensive_details = yield wealthsimple.getSecurity(ticker, true);
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: extensive_details.id,
        market_value: extensive_details.quote.amount,
        quantity: quantity,
        order_type: "sell_quantity",
        order_sub_type: "market",
        time_in_force: "day",
        account_id: accountId
      });
    });

    function marketSell(_x16, _x17, _x18) {
      return _marketSell.apply(this, arguments);
    }

    return marketSell;
  }(),

  /**
   * Limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  limitSell: function () {
    var _limitSell = _asyncToGenerator(function* (accountId, ticker, limit, quantity) {
      return (0, _https.handleRequest)(_endpoints.default.PLACE_ORDER, {
        security_id: (yield wealthsimple.getSecurity(ticker)).id,
        limit_price: limit,
        quantity,
        order_type: "sell_quantity",
        order_sub_type: "limit",
        time_in_force: "day",
        account_id: accountId
      });
    });

    function limitSell(_x19, _x20, _x21, _x22) {
      return _limitSell.apply(this, arguments);
    }

    return limitSell;
  }(),

  /**
   * Stop limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  stopLimitSell: function () {
    var _stopLimitSell = _asyncToGenerator(function* (accountId, ticker, stop, limit, quantity) {
      let security = yield wealthsimple.getSecurity(ticker); // The WealthSimple Trade backend doesn't check for this, even though the app does..

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
      });
    });

    function stopLimitSell(_x23, _x24, _x25, _x26, _x27) {
      return _stopLimitSell.apply(this, arguments);
    }

    return stopLimitSell;
  }()
};
exports.default = _default;