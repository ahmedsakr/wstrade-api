import handleRequest, { refreshAuthentication } from './network/https';
import endpoints from './api/endpoints';
import tokens from './core/tokens';

// authentication events
const events = {
  otp: null,
};

export default {

  /**
   * Register a function to run on a certain event.
   *
   * @param {*} event The trigger for the function
   * @param {*} handler event handler for the event
   */
  on(event, handler) {
    if (!(event in events)) {
      throw new Error(`Unsupported authentication event '${event}'!`);
    }

    events[event] = handler;
  },

  /**
   * Initialize the auth module with an existing state of tokens.
   * The state provided should contain access, refresh, and expires properties.
   *
   * @param {*} state Pre-existing authentication state
   */
  use: (state) => tokens.store(state),

  /**
   * Snapshot of the current authentication tokens.
   */
  tokens: () => ({ access: tokens.access, refresh: tokens.refresh, expires: tokens.expires }),

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
    if (typeof (events.otp) === 'function') {
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
        otp: typeof (events.otp) === 'function' ? await events.otp() : events.otp,
      });
    } catch (error) {
      // we might have failed because OTP was not provided
      if (!events.otp) {
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
