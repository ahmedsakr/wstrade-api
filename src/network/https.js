import fetch from 'node-fetch';
import status from 'http-status';
import customHeaders from '../headers';
import auth from '../auth';

// WealthSimple Trade API returns some custom HTTP codes
const wealthSimpleHttpCodes = {
  ORDER_CREATED: 201
}

// Successful HTTP codes to be used for determining the status of the request
const httpSuccessCodes = [
  status.OK,
  wealthSimpleHttpCodes.ORDER_CREATED
]

export const isSuccessfulRequest = (code) => httpSuccessCodes.includes(code);

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data.
 */
export async function handleRequest(endpoint, data) {
  try {

    // Retrieve secret tokens
    let tokens = auth.tokens;

    // Submit the HTTP request to the WealthSimple Trade Servers
    const response = await talk(endpoint, data, tokens);

    if (isSuccessfulRequest(response.status)) {
      return endpoint.onSuccess({
        arguments: data,
        response
      });
    } else {
      return Promise.reject(await endpoint.onFailure(response));
    }

  } catch (error) {

    // This is likely a network error; throw it to the caller to deal with.
    throw error;
  }
}
  
/*
 * Complete the URL by filling the parameter placeholders with the
 * data arguments.
 */
function finalizeRequest(endpoint, data) {

  let url = endpoint.url;

  // No need to do anything if the URL is static (no parameters)
  if (endpoint.parameters) {

    // Swap all the parameter placeholders with the arguments.
    for (let index = 0; index < Object.keys(endpoint.parameters).length; index++) {
      if (data[endpoint.parameters[index]] === null || data[endpoint.parameters[index]] === undefined) {
        throw new Error("URL Path parameter missing");
      }
  
      url = url.replace(`{${index}}`, data[endpoint.parameters[index]]);

      // Must remove this key from the payload as it has been consumed by the URL
      delete data[endpoint.parameters[index]];
    }
  }

  // No payload attached to GET/DELETE requests
  if (['GET', 'HEAD'].includes(endpoint.method)) {
    return { url, payload: undefined };
  }

  return { url, payload: JSON.stringify(data) };
}
  
/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */
function talk(endpoint, data, tokens) {
  let headers = new fetch.Headers();
  headers.append('Content-Type', 'application/json');

  // Apply all custom headers
  customHeaders.values().forEach(header => headers.append(...header));

  if (tokens) {
    headers.append('Authorization', tokens.access)
  }

  // Make a copy of the arguments so the original copy is not modified
  let copy = Object.assign({}, data);

  // fill path and query parameters in the URL
  let { url, payload } = finalizeRequest(endpoint, copy);

  return fetch(url, {
    body: payload,
    method: endpoint.method,
    headers
  });
}