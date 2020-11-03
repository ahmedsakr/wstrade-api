import fetch from 'node-fetch';  

let customHeaders = new fetch.Headers();

export default {

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
  remove: (name) => customHeaders.delete(name),

  /**
   * Clears all custom headers.
   */
  clear: () => [...customHeaders].forEach(header => customHeaders.delete(header[0])),

  /**
   * Produces a list of custom headers.
   */
  values: () => [...customHeaders],
}