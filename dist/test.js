"use strict";

var _index = _interopRequireDefault(require("./index"));

var _ticker = _interopRequireDefault(require("./core/ticker"));

var _typescript = require("typescript");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log(new _ticker.default("AAPL:kl").format());

_typescript.sys.exit(1);

_index.default.auth.on('otp', '506687');

_index.default.auth.login('ahmed@sakr.ca', 'meax5meag@fawn4MIST').then( /*#__PURE__*/_asyncToGenerator(function* () {
  console.log(yield _index.default.data.getSecurity('AAPL:NASDAQ', true));
})).catch(error => console.log(error));