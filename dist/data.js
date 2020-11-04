"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _endpoints = _interopRequireDefault(require("./api/endpoints"));

var _https = require("./network/https");

var _ticker = _interopRequireDefault(require("./core/ticker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  /**
   * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   *
   */
  exchangeRates: function () {
    var _exchangeRates = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.EXCHANGE_RATES, {});
    });

    function exchangeRates() {
      return _exchangeRates.apply(this, arguments);
    }

    return exchangeRates;
  }(),

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from the symbol with a colon, for example: AAPL:NASDAQ, ENB:TSX
   * @param {string} ticker.symbol The security symbol.
   * @param {string} [ticker.exchange] (optional) the exchange the security trades in
   * @param {string} [ticker.id] (optional) The internal WealthSimple Trade security ID
   * @param {boolean} extensive Pulls a more detailed report of the security using the /securities/{id} API
   */
  getSecurity: function () {
    var _getSecurity = _asyncToGenerator(function* (ticker, extensive) {
      // Run some validation on the ticker
      ticker = new _ticker.default(ticker);

      if (ticker.id) {
        /*
         * There is no need to filter results based on exchange because we are given the unique id.
         * 
         * We will immediately call the extensive details API since we have the id.
         */
        return (0, _https.handleRequest)(_endpoints.default.EXTENSIVE_SECURITY_DETAILS, {
          id: ticker.id
        });
      }

      let queryResult = yield (0, _https.handleRequest)(_endpoints.default.SECURITY, {
        ticker: ticker.symbol
      });
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
        return (0, _https.handleRequest)(_endpoints.default.EXTENSIVE_SECURITY_DETAILS, {
          id: queryResult[0].id
        });
      }

      return queryResult[0];
    });

    function getSecurity(_x, _x2) {
      return _getSecurity.apply(this, arguments);
    }

    return getSecurity;
  }()
};
exports.default = _default;