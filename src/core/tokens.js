import epochSeconds from '../helpers/time';

/**
 * This module will provide a uniform interface for storage
 * and retrieval of authenticaton tokens throughout wstrade-api.
 */
class Tokens {
  /**
   * Creates a new authentication tokens object.
   */
  constructor() {
    this.access = null;
    this.refresh = null;
    this.expires = null;
  }

  /**
   * Updates the authentication tokens.
   *
   * @param {*} tokens The new tokens
   */
  store(tokens) {
    this.access = tokens.access;
    this.refresh = tokens.refresh;
    this.expires = tokens.expires;
  }

  /**
   * Checks if the current tokens have expired.
   */
  expired() {
    return this.expires && epochSeconds() >= this.expires;
  }
}

export default Tokens;
