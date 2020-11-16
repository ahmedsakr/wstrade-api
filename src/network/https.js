import fetch from 'node-fetch';
import status from 'http-status';
import customHeaders from '../headers';
import auth from '../auth';

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data.
 */
export async function handleRequest(endpoint, data) {
  try {

    // Submit the HTTP request to the WealthSimple Trade Servers
    const response = await talk(endpoint, data);

    if ([status.OK, status.CREATED].includes(response.status)) {
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

  // Make a copy so we don't modify the original one.
  data = Object.assign({}, data);

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
 * Validate the auth token for expiry, attempting to refresh it
 * if we have the refresh token.
 */
async function checkAuthTokenExpiry() {
  const epoch_sec = () => parseInt(Date.now()/1000);

  if (epoch_sec() >= auth.tokens?.expires) {
    if (auth.tokens?.refresh) {
      try {

        // Let's implicitly refresh the access token using the refresh token.
        await auth.refresh();
      } catch (error) {

        // The refresh token is not valid.
        return Promise.reject(`Unable to refresh expired token: ${error}`);
      }
    } else {

      // We are forced to reject as our access token has expired and we
      // do not have a refresh token.
      return Promise.reject('Access token expired');
    }
  }

  return true;
}
  
/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */
async function talk(endpoint, data) {
  let headers = new fetch.Headers();
  headers.append('Content-Type', 'application/json');

  if (auth.tokens?.access && await checkAuthTokenExpiry()) {
    headers.append('Authorization', auth.tokens.access)
  }

  // Apply all custom headers
  customHeaders.values().forEach(header => headers.append(...header));

  // fill path and query parameters in the URL
  let { url, payload } = finalizeRequest(endpoint, data);

  return fetch(url, {
    body: payload,
    method: endpoint.method,
    headers
  });
}