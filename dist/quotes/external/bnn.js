"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
 * DISCLAIMER:
 * ---
 * 
 * This implementation is provided with no guarantee to the data it retrieves.
 * BNN is an external entity and this file has no control over the integrity of
 * the data received. Use at your own risk.
 */
const BNN_ENDPOINT = "https://data.bnn.ca/dispenser/hydra/dapi/stockChart?s=";
/*
 * BNN (Bloomberg) provides near real-time quotes for U.S. equities.
 */

const bnn = {
  // Supported exchanges
  exchanges: ['NYSE', 'NASDAQ', 'TSX'],
  // Exchanges that BNN can provide near real-time quotes for.
  realtime: ['NYSE', 'NASDAQ'],

  /*
   *
   */
  getQuote: function () {
    var _getQuote = _asyncToGenerator(function* (ticker, exchange) {
      let headers = new _nodeFetch.default.Headers();
      headers.append('Referer', 'https://www.bnnbloomberg.ca/');
      let response = yield (0, _nodeFetch.default)(`${BNN_ENDPOINT}${ticker}:${exchange}`, {
        body: undefined,
        method: "GET",
        headers
      });
      return (yield response.json()).data.stocks[0].price;
    });

    function getQuote(_x, _x2) {
      return _getQuote.apply(this, arguments);
    }

    return getQuote;
  }()
};
var _default = bnn;
exports.default = _default;