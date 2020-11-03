"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default2 = _interopRequireDefault(require("./default"));

var _data = _interopRequireDefault(require("../data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  // WealthSimple Trade is our default source for quotes, despite
  // having a 15 min delay
  default: _default2.default,
  // Maintains quote providers on an exchange basis
  providers: {},

  /**
   * Load a custom provider for the exchange.
   * 
   * @param {*} exchange The exchange that the provider fetches quotes for
   * @param {*} provider The provider object containing the quote() implementation.
   */
  use: function use(exchange, provider) {
    if (typeof provider.quote != 'function') {
      // The provider must have a quote() implementation that we can call later!
      throw new Error(`Invalid quote provider for ${exchange}!`);
    }

    this.providers[exchange] = provider;
  },

  /**
   * Obtains a quote for the ticker. The source of the quote may be a custom
   * provider if a valid provider is registered for the exchange that the
   * ticker trades on.
   *
   * @param {*} ticker The security to get a quote for.
   */
  get: function () {
    var _get = _asyncToGenerator(function* (ticker) {
      let info = yield _data.default.getSecurity(ticker, false);
      let exchange = info.stock.primary_exchange; // A custom provider will take precedence over the default source

      if (this.providers.hasOwnProperty(exchange)) {
        return this.providers[exchange].quote(ticker);
      } else {
        return this.default.quote(ticker);
      }
    });

    function get(_x) {
      return _get.apply(this, arguments);
    }

    return get;
  }()
};
exports.default = _default;