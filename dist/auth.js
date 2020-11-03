"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _https = require("./network/https");

var _endpoints = _interopRequireDefault(require("./api/endpoints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  // Authentication tokens to access privileged endpoints
  tokens: null,
  // Thunk for retrieving the one-time password.
  otp: null,

  /**
   * Register a function to run on a certain event
   * @param {*} event The trigger for the function
   * @param {*} thunk The function block to execute on event trigger
   */
  on: function on(event, thunk) {
    this[event] = thunk;
  },

  /**
   * Attempts to establish a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   */
  login: function () {
    var _login = _asyncToGenerator(function* (email, password) {
      // We attempt to login to trigger an One-Time Password (OTP) event.
      let response = yield (0, _https.handleRequest)(_endpoints.default.LOGIN, {
        email,
        password
      }).catch(() => {});

      if (typeof this.otp === 'function') {
        // Right on - the user has given us a function that we can get the OTP code from.
        // Let's log in for real this time.
        response = yield (0, _https.handleRequest)(_endpoints.default.LOGIN, {
          email,
          password,
          otp: yield this.otp()
        });
      } else {
        // We don't have a way to get the OTP, so we reject.
        return Promise.reject("OTP not retrievable!");
      } // Capture the tokens for later usage.


      this.tokens = response.tokens;
    });

    function login(_x, _x2) {
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
      this.tokens = response.tokens;
    });

    function refresh() {
      return _refresh.apply(this, arguments);
    }

    return refresh;
  }()
};
exports.default = _default;