"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("../data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  /**
   * Quote for a ticker from the WealthSimple Trade endpoint.
   *
   * Remember that this quote is NOT real-time!
   */
  quote: function () {
    var _quote = _asyncToGenerator(function* (ticker) {
      let info = yield _data.default.getSecurity(ticker, true);
      return info.quote.amount;
    });

    function quote(_x) {
      return _quote.apply(this, arguments);
    }

    return quote;
  }()
};
exports.default = _default;