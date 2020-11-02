"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let quotes = {
  /*
   *
   */
  providers: {
    nyse: null,
    nasdaq: null,
    tsx: null,
    tsxv: null
  },

  /*
   * Load a custom provider for the exchange.
   */
  use: function use(exchange, provider) {
    this.providers[exchange] = require(`./external/${provider}`).default;
  },
  getQuote: function () {
    var _getQuote = _asyncToGenerator(function* (ticker, exchange) {
      return this.providers[exchange].getQuote(ticker, exchange);
    });

    function getQuote(_x, _x2) {
      return _getQuote.apply(this, arguments);
    }

    return getQuote;
  }()
};
var _default = quotes;
exports.default = _default;