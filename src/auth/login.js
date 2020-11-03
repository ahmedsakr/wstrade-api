import { handleRequest } from '../network/https';
import endpoints from '../api/endpoints';

let login = {

  tokens: null,

  /**
   * Attempts to create a session for the provided email and password.
   *
   * @param {*} email emailed registered by the WealthSimple Trade account
   * @param {*} password The password of the account
   * @param {*} otp_func otp function (async/sync) that provides the OTP code somehow
   */
  login: async function (email, password, otp_func) {
    let response = null;

    if (typeof(otp_func) === 'function') {
      response = await handleRequest(endpoints.LOGIN, { email, password, otp: await otp_func() });
    } else {
      response = await handleRequest(endpoints.LOGIN, { email, password });
    }

    this.tokens = response.tokens;
  },

  /**
   * Generates a new set of access and refresh tokens.
   *
   * @param {*} tokens The access and refresh tokens returned by a successful login.
   */
  refresh: async function () {
    let response = await handleRequest(endpoints.REFRESH, { refresh_token: tokens.refresh }, this.tokens);
    this.tokens = response.tokens;
  },
};

export default login;
