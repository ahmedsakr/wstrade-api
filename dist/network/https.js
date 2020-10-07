"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRequest = handleRequest;
exports.isSuccessfulRequest = exports.headers = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _httpStatus = _interopRequireDefault(require("http-status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let customHeaders = new _nodeFetch.default.Headers(); // External API to mutate custom headers

const headers = {
  add: (name, value) => customHeaders.append(name, value),
  remove: name => customHeaders.delete(name),
  clear: () => [...customHeaders].forEach(header => customHeaders.delete(header[0]))
}; // WealthSimple Trade API returns some custom HTTP codes

exports.headers = headers;
const wealthSimpleHttpCodes = {
  ORDER_CREATED: 201
}; // Successful HTTP codes to be used for determining the status of the request

const httpSuccessCodes = [_httpStatus.default.OK, wealthSimpleHttpCodes.ORDER_CREATED];

const isSuccessfulRequest = code => httpSuccessCodes.includes(code);
/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data, and the authentication tokens.
 */


exports.isSuccessfulRequest = isSuccessfulRequest;

function handleRequest(_x, _x2, _x3) {
  return _handleRequest.apply(this, arguments);
}
/*
 * Complete the URL by filling the parameter placeholders with the
 * data arguments.
 */


function _handleRequest() {
  _handleRequest = _asyncToGenerator(function* (endpoint, data, tokens) {
    try {
      // Submit the HTTP request to the WealthSimple Trade Servers
      const response = yield talk(endpoint, data, tokens);

      if (isSuccessfulRequest(response.status)) {
        return endpoint.onSuccess({
          arguments: data,
          response
        }, tokens);
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


function talk(endpoint, data, tokens) {
  let headers = new _nodeFetch.default.Headers();
  headers.append('Content-Type', 'application/json'); // Apply all custom headers

  [...customHeaders].forEach(header => headers.append(...header));

  if (tokens) {
    headers.append('Authorization', tokens.access);
  } // Make a copy of the arguments so the original copy is not modified


  let copy = Object.assign({}, data); // fill path and query parameters in the URL

  let _finalizeRequest = finalizeRequest(endpoint, copy),
      url = _finalizeRequest.url,
      payload = _finalizeRequest.payload;

  return (0, _nodeFetch.default)(url, {
    body: payload,
    method: endpoint.method,
    headers
  });
}