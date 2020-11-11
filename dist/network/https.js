"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRequest = handleRequest;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _headers = _interopRequireDefault(require("../headers"));

var _auth = _interopRequireDefault(require("../auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data.
 */
function handleRequest(_x, _x2) {
  return _handleRequest.apply(this, arguments);
}
/*
 * Complete the URL by filling the parameter placeholders with the
 * data arguments.
 */


function _handleRequest() {
  _handleRequest = _asyncToGenerator(function* (endpoint, data) {
    try {
      // Submit the HTTP request to the WealthSimple Trade Servers
      const response = yield talk(endpoint, data);

      if ([_httpStatus.default.OK, _httpStatus.default.CREATED].includes(response.status)) {
        return endpoint.onSuccess({
          arguments: data,
          response
        });
      } else {
        return Promise.reject(yield endpoint.onFailure(response));
      }
    } catch (error) {
      // This is likely a network error; throw it to the caller to deal with.
      throw error;
    }
  });
  return _handleRequest.apply(this, arguments);
}

function finalizeRequest(endpoint, data) {
  // Make a copy so we don't modify the original one.
  data = Object.assign({}, data);
  let url = endpoint.url; // No need to do anything if the URL is static (no parameters)

  if (endpoint.parameters) {
    // Swap all the parameter placeholders with the arguments.
    for (let index = 0; index < Object.keys(endpoint.parameters).length; index++) {
      if (data[endpoint.parameters[index]] === null || data[endpoint.parameters[index]] === undefined) {
        throw new Error("URL Path parameter missing");
      }

      url = url.replace(`{${index}}`, data[endpoint.parameters[index]]); // Must remove this key from the payload as it has been consumed by the URL

      delete data[endpoint.parameters[index]];
    }
  } // No payload attached to GET/DELETE requests


  if (['GET', 'HEAD'].includes(endpoint.method)) {
    return {
      url,
      payload: undefined
    };
  }

  return {
    url,
    payload: JSON.stringify(data)
  };
}
/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */


function talk(endpoint, data) {
  let headers = new _nodeFetch.default.Headers();
  headers.append('Content-Type', 'application/json');

  if (_auth.default.tokens) {
    headers.append('Authorization', _auth.default.tokens.access);
  } // Apply all custom headers


  _headers.default.values().forEach(header => headers.append(...header)); // fill path and query parameters in the URL


  let _finalizeRequest = finalizeRequest(endpoint, data),
      url = _finalizeRequest.url,
      payload = _finalizeRequest.payload;

  return (0, _nodeFetch.default)(url, {
    body: payload,
    method: endpoint.method,
    headers
  });
}