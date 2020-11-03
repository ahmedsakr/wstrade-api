"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getTokens = void 0;

var _https = require("./network/https");

var _endpoints = _interopRequireDefault(require("./api/endpoints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let tokens = null;

const getTokens = () => tokens;

exports.getTokens = getTokens;
var _default = {
  /**
   * Attempts to create a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   * @param {*} otp_func otp function (async/sync) that provides the OTP code somehow
   */
  login: function () {
    var _login = _asyncToGenerator(function* (email, password, otp_func) {
      let response = null;

      if (typeof otp_func === 'function') {
        response = yield (0, _https.handleRequest)(_endpoints.default.LOGIN, {
          email,
          password,
          otp: yield otp_func()
        });
      } else {
        response = yield (0, _https.handleRequest)(_endpoints.default.LOGIN, {
          email,
          password
        });
      }

      tokens = response.tokens;
    });

    function login(_x, _x2, _x3) {
      return _login.apply(this, arguments);
    }

    return login;
  }(),

  /**
   * Generates a new set of access and refresh tokens.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  refresh: function () {
    var _refresh = _asyncToGenerator(function* () {
      let response = yield (0, _https.handleRequest)(_endpoints.default.REFRESH, {
        refresh_token: tokens.refresh
      });
      tokens = response.tokens;
    });

    function refresh() {
      return _refresh.apply(this, arguments);
    }

    return refresh;
  }()
};
exports.default = _default;