"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let customHeaders = new _nodeFetch.default.Headers();
var _default = {
  /**
   * Appends a header name-value pair to all requests.
   * 
   * @param {*} name Header key
   * @param {*} value Header value
   */
  add: (name, value) => customHeaders.append(name, value),

  /**
   * Removes a custom header from all requests.
   * 
   * @param {*} name Header key
   */
  remove: name => customHeaders.delete(name),

  /**
   * Clears all custom headers.
   */
  clear: () => [...customHeaders].forEach(header => customHeaders.delete(header[0])),

  /**
   * Produces a list of custom headers.
   */
  values: () => [...customHeaders]
};
exports.default = _default;