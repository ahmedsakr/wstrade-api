import { handleRequest } from './network/https';
import endpoints from './api/endpoints';

export default {

  // Authentication tokens to access privileged endpoints
  tokens: null,

  // Thunk for retrieving the one-time password.
  otp: null,

  /**
   * Register a function to run on a certain event
   * @param {*} event The trigger for the function
   * @param {*} thunk The function block to execute on event trigger
   */
  on: function (event, thunk) {
    this[event] = thunk;
  },

  /**
   * Attempts to establish a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   */
  login: async function (email, password) {

    // We attempt to login to trigger an One-Time Password (OTP) event.
    let response = await handleRequest(endpoints.LOGIN, { email, password }).catch(() => {});

    if (typeof(this.otp) === 'function') {

      // Right on - the user has given us a function that we can get the OTP code from.
      // Let's log in for real this time.
      response = await handleRequest(endpoints.LOGIN, { email, password, otp: await this.otp() });
    } else {

      // We don't have a way to get the OTP, so we reject.
      return Promise.reject("OTP not retrievable!");
    }

    // Capture the tokens for later usage.
    this.tokens = response.tokens;
  },

  /**
   * Generates a new set of access and refresh tokens.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  refresh: async function () {
    let response = await handleRequest(endpoints.REFRESH, { refresh_token: tokens.refresh });
    this.tokens = response.tokens;
  },
};
