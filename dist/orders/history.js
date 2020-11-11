"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _endpoints = _interopRequireWildcard(require("../api/endpoints"));

var _https = require("../network/https");

var _ticker = _interopRequireDefault(require("../core/ticker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
 * Retrieves orders that have the specified status.
 */
const filteredOrders = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (accountId, ticker, status) {
    return (0, _https.handleRequest)(_endpoints.default.FILTERED_ORDERS, {
      accountId,
      ticker: new _ticker.default(ticker),
      status
    });
  });

  return function filteredOrders(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = {
  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} page The orders page index to seek to
   */
  page: function () {
    var _page2 = _asyncToGenerator(function* (accountId, _page) {
      return (0, _https.handleRequest)(_endpoints.default.ORDERS_BY_PAGE, {
        offset: (_page - 1) * _endpoints.ORDERS_PER_PAGE,
        accountId
      });
    });

    function page(_x4, _x5) {
      return _page2.apply(this, arguments);
    }

    return page;
  }(),

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  all: function () {
    var _all = _asyncToGenerator(function* (accountId) {
      return (0, _https.handleRequest)(_endpoints.default.ALL_ORDERS, {
        offset: 0,
        accountId
      });
    });

    function all(_x6) {
      return _all.apply(this, arguments);
    }

    return all;
  }(),

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  pending: function () {
    var _pending = _asyncToGenerator(function* (accountId, ticker) {
      return filteredOrders(accountId, ticker, 'submitted');
    });

    function pending(_x7, _x8) {
      return _pending.apply(this, arguments);
    }

    return pending;
  }(),

  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  filled: function () {
    var _filled = _asyncToGenerator(function* (accountId, ticker) {
      return filteredOrders(accountID, ticker, 'posted');
    });

    function filled(_x9, _x10) {
      return _filled.apply(this, arguments);
    }

    return filled;
  }(),

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
    * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  cancelled: function () {
    var _cancelled = _asyncToGenerator(function* (accountId, ticker) {
      return filteredOrders(accountId, ticker, 'cancelled');
    });

    function cancelled(_x11, _x12) {
      return _cancelled.apply(this, arguments);
    }

    return cancelled;
  }()
};
exports.default = _default;