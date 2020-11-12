"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _endpoints = _interopRequireDefault(require("./api/endpoints"));

var _https = require("./network/https");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   *
   */
  all: function () {
    var _all = _asyncToGenerator(function* () {
      let accounts = yield (0, _https.handleRequest)(_endpoints.default.ACCOUNT_IDS, {});
      return {
        tfsa: accounts.find(account => account.startsWith('tfsa')),
        rrsp: accounts.find(account => account.startsWith('rrsp')),
        crypto: accounts.find(account => account.startsWith('non-registered-crypto')),
        personal: accounts.find(account => account.startsWith('non-registered') && !account.startsWith('non-registered-crypto'))
      };
    });

    function all() {
      return _all.apply(this, arguments);
    }

    return all;
  }(),

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
   */
  data: function () {
    var _data = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.LIST_ACCOUNT, {});
    });

    function data() {
      return _data.apply(this, arguments);
    }

    return data;
  }(),

  /**
   * Retrieves some surface information about you like your name and email, account
   * signatures, and other metadata.
   */
  me: function () {
    var _me = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.ME, {});
    });

    function me() {
      return _me.apply(this, arguments);
    }

    return me;
  }(),

  /**
   * Detailed information about you that you provided on signup, like residential and
   * mailing addresses, employment, phone numbers, and so on.
   */
  person: function () {
    var _person = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.PERSON, {});
    });

    function person() {
      return _person.apply(this, arguments);
    }

    return person;
  }(),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  history: function () {
    var _history = _asyncToGenerator(function* (interval, accountId) {
      return (0, _https.handleRequest)(_endpoints.default.HISTORY_ACCOUNT, {
        interval,
        accountId
      });
    });

    function history(_x, _x2) {
      return _history.apply(this, arguments);
    }

    return history;
  }(),

  /**
   * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
   *
   */
  activities: function () {
    var _activities = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.ACTIVITIES, {});
    });

    function activities() {
      return _activities.apply(this, arguments);
    }

    return activities;
  }(),

  /**
   * Retrieves all bank accounts linked to the WealthSimple Trade account.
   */
  getBankAccounts: function () {
    var _getBankAccounts = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.BANK_ACCOUNTS, {});
    });

    function getBankAccounts() {
      return _getBankAccounts.apply(this, arguments);
    }

    return getBankAccounts;
  }(),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   */
  deposits: function () {
    var _deposits = _asyncToGenerator(function* () {
      return (0, _https.handleRequest)(_endpoints.default.DEPOSITS, {});
    });

    function deposits() {
      return _deposits.apply(this, arguments);
    }

    return deposits;
  }(),

  /**
   * Lists all positions in the specified trading account under the WealthSimple Trade Account.
   * 
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  positions: function () {
    var _positions = _asyncToGenerator(function* (accountId) {
      return (0, _https.handleRequest)(_endpoints.default.POSITIONS, {
        accountId
      });
    });

    function positions(_x3) {
      return _positions.apply(this, arguments);
    }

    return positions;
  }()
};
exports.default = _default;