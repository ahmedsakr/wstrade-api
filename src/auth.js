import handleRequest, { refreshAuthentication } from './network/https';
import endpoints from './api/endpoints';
import tokens from './core/tokens';

export default {

  // Thunk for retrieving the one-time password.
  otp: null,

  /**
   * Register a function to run on a certain event
   * @param {*} event The trigger for the function
   * @param {*} thunk The function block to execute on event trigger
   */
  on(event, thunk) {
    this[event] = thunk;
  },

  /**
   * Initialize the authentication tokens with an existing state.
   * The state provided should contain access, refresh, and expires properties.
   *
   * @param {*} state Pre-existing authentication state
   */
  use: (state) => tokens.store(state),

  /**
   * Snapshot of the current authentication state.
   */
  tokens: () => ({ ...tokens }),

  /**
   * Attempts to establish a session for the provided email and password.
   *
   * @param {*} email emailed registered by the Wealthsimple Trade account
   * @param {*} password The password of the account
   */
  async login(email, password) {
    let response = null;

    /*
     * If we are given a function for otp, then we must fail a log in to
     * trigger an OTP event with Wealthsimple Trade. This will allow the user
     * otp thunk to retrieve the code.
     *
     * If a literal value is provided for otp, it means the user has manually
     * provided us with the otp code. We can skip this login attempt.
     */
    if (typeof (this.otp) === 'function') {
      await handleRequest(endpoints.LOGIN, {
        email,
        password,
      }).catch(() => {});
    }

    // Try to log in for real this time.
    try {
      response = await handleRequest(endpoints.LOGIN, {
        email,
        password,
        otp: typeof (this.otp) === 'function' ? await this.otp() : this.otp,
      });
    } catch (error) {
      // we might have failed because OTP was not provided
      if (!this.otp) {
        throw new Error('OTP not provided!');
      }

      // Seems to be incorrect credentials or OTP.
      throw error;
    }

    // Capture the tokens for later usage.
    this.use(response.tokens);
  },

  /**
   * Generates a new set of access and refresh tokens.
   */
  refresh: async () => refreshAuthentication(),
};
