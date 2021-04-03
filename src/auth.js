class Authentication {
  /**
   * Creates an instance of the Authentication classs associated with the
   * provided tokens and https worker.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker) {
    this.worker = httpsWorker;
  }

  /**
   * Register a function to run on a certain event.
   *
   * @param {*} event The trigger for the function
   * @param {*} handler event handler for the event
   */
  on(event, handler) {
    return this.worker.on(event, handler);
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
    return this.worker.login(email, password);
  }

  /**
   * Generates a new set of access and refresh tokens.
   */
  async refresh() {
    return this.worker.refreshAuthentication();
  }
}

export default Authentication;
