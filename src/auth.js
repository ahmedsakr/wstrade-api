import endpoints from './api/endpoints';

class Authentication {
  /**
   * Creates an instance of the Authentication classs associated with the
   * provided tokens and https worker.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker) {
    this.worker = httpsWorker;

    // authentication events
    this.events = {
      otp: null,
      refresh: null,
    };
  }

  /**
   * Register a function to run on a certain event.
   *
   * @param {*} event The trigger for the function
   * @param {*} handler event handler for the event
   */
  on(event, handler) {
    if (!(event in this.events)) {
      throw new Error(`Unsupported authentication event '${event}'!`);
    }
    // this creates a edge case in the list of events
    // because we're now partly a configuration proxy and validation for a
    // setting that's in https.js
    if (event == 'refresh') {
      this.worker.on(event, handler)
    } else {
      this.events[event] = handler;
    }
  }

  /**
   * Initialize the auth module with an existing state of tokens.
   * The state provided should contain access, refresh, and expires properties.
   *
   * @param {*} state Pre-existing authentication state
   */
  use(state) {
    this.worker.tokens.store(state);
  }

  /**
   * Snapshot of the current authentication tokens.
   */
  tokens() {
    return {
      access: this.worker.tokens.access,
      refresh: this.worker.tokens.refresh,
      expires: this.worker.tokens.expires,
    };
  }

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
    if (typeof (this.events.otp) === 'function') {
      await this.worker.handleRequest(endpoints.LOGIN, {
        email,
        password,
      }).catch(() => { });
    }

    // Try to log in for real this time.
    try {
      response = await this.worker.handleRequest(endpoints.LOGIN, {
        email,
        password,
        otp: typeof (this.events.otp) === 'function' ? await this.events.otp() : this.events.otp,
      });
    } catch (error) {
      // we might have failed because OTP was not provided
      if (!this.events.otp) {
        throw new Error('OTP not provided!');
      }

      // Seems to be incorrect credentials or OTP.
      throw error;
    }

    // Capture the tokens for later usage.
    this.use(response.tokens);
  }

  /**
   * Generates a new set of access and refresh tokens.
   */
  async refresh() {
    return this.worker.refreshAuthentication();
  }
}

export default Authentication;
