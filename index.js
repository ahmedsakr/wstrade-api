import fetch from 'node-fetch';

const WealthSimpleTradeEndpoints = {

  // Common failure method for all endpoint calls
  onFailure: (response) => {
    return {
      status: response.status,
      reason: response.statusText
    }
  },

  /*
   * The LOGIN endpoint intializes a new session for the given email and
   * password set. If the login is successful, access and refresh tokens
   * are returned in the headers. The access token is the key for invoking
   * all other end points.
   */
  LOGIN: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/login",
    onSuccess: async (response) => {
      return {
        tokens: {
          access: response.headers.get('x-access-token'),
          refresh: response.headers.get('x-refresh-token')
        },

        accountInfo: await response.json()
      };
    },
  },

  /*
   * The LIST_ACCOUNT endpoint retrieves general metadata of the
   * WealthSimple Trade account, including balances, account id, and
   * more.
   */
  LIST_ACCOUNT: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: async (response) => {
      return {
        data: await response.json()
      }
    }
  }
}

/*
 * Fulfill the endpoint request given the endpoint configuration, optional
 * data, and the authentication tokens.
 */
async function handleRequest(endpoint, data, tokens) {
  try {
    
    // Submit the HTTP request to the WealthSimple Trade Servers
    const response = await talk(endpoint, data, tokens);

    if (response.status == 200) {
      return endpoint.onSuccess(response);
    } else {
      return Promise.reject(WealthSimpleTradeEndpoints.onFailure(response));
    }

  } catch (error) {

    // This is likely a network error; throw it to the caller to deal with.
    throw error;
  }
}

/*
 * Implements the network level protocol for talking to the
 * WealthSimple Trade HTTPS API.
 */
function talk(endpoint, data, tokens) {
  let headers = new fetch.Headers();
  headers.append('Content-Type', 'application/json');

  if (tokens) {
    headers.append('Authorization', `${tokens.access}`)
  }

  return fetch(endpoint.url, {
    body: endpoint.method === 'GET' ? undefined: JSON.stringify(data),
    method: endpoint.method,
    headers: headers
  })
}

/**
 * Attempts to create a session for the provided email and password.
 *
 * @param {*} email emailed registered by the WealthSimple Trade account
 * @param {*} password The password of the account
 */
export const login = async (email, password) => handleRequest(WealthSimpleTradeEndpoints.LOGIN, { email, password });

/**
 * Retrieves the top-level data of the account, including account id, account types, account values, and more.
 *
 * @param {*} tokens The access and refresh tokens returned by a successful login.
 */
export const getAccountData = async (tokens) => handleRequest(WealthSimpleTradeEndpoints.LIST_ACCOUNT, {}, tokens);