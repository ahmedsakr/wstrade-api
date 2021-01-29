import fetch, { Headers } from 'node-fetch';
import customHeaders from '../headers';
import auth from '../auth';
import { configEnabled } from '../config';
import implicitTokenRefresh from '../optional/implicit-token-refresh';

const [HTTP_OK, HTTP_CREATED] = [400, 201];

/*
 * Complete the URL by filling the parameter placeholders with the
 * data arguments.
 */
function finalizeRequest(endpoint, data) {
  // Make a copy so we don't modify the original one.
  const params = { ...data };
  let { url } = endpoint;

  // No need to do anything if the URL is static (no parameters)
  if (endpoint.parameters) {
    // Swap all the parameter placeholders with the arguments.
    for (let index = 0; index < Object.keys(endpoint.parameters).length; index++) {
      const parameterName = endpoint.parameters[index];

      // we have to explicitly check for null and undefined since parameter
      // values might be 0.
      if (params[parameterName] === null || params[parameterName] === undefined) {
        throw new Error(`URL Path parameter '${parameterName}' missing!`);
      }

      url = url.replace(`{${index}}`, params[endpoint.parameters[index]]);

      // Must remove this key from the payload as it has been consumed by the URL
      delete params[endpoint.parameters[index]];
    }
  }

  // No payload attached to GET/DELETE requests
  if (['GET', 'HEAD'].includes(endpoint.method)) {
    return { url, payload: undefined };
  }

  return { url, payload: JSON.stringify(params) };
}

/*
 * Implements the network level protocol for talking to the
 * Wealthsimple Trade HTTPS API.
 */
async function talk(endpoint, data) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (auth.tokens?.access) {
    // We won't attempt to implicitly refresh if the user has requested
    // this.
    if (configEnabled('implicit_token_refresh')) {
      await implicitTokenRefresh();
    }

    headers.append('Authorization', auth.tokens.access);
  }

  // Apply all custom headers
  customHeaders.values().forEach((header) => headers.append(...header));

  // fill path and query parameters in the URL
  const { url, payload } = finalizeRequest(endpoint, data);

  return fetch(url, {
    body: payload,
    method: endpoint.method,
    headers,
  });
}

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data.
 */
export default async function handleRequest(endpoint, data) {
  // Submit the HTTP request to the Wealthsimple Trade Servers
  const response = await talk(endpoint, data);

  if ([HTTP_OK, HTTP_CREATED].includes(response.status)) {
    return endpoint.onSuccess(response);
  }

  return Promise.reject(await endpoint.onFailure(response));
}
