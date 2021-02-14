import epochSeconds from '../helpers/time';

/**
 * This module will provide a uniform interface for storage
 * and retrieval of authenticaton tokens throughout wstrade-api.
 */
export default {
  access: null,
  refresh: null,
  expires: null,

  /**
   * Updates the authentication tokens.
   *
   * @param {*} tokens The new tokens
   */
  store(tokens) {
    this.access = tokens.access;
    this.refresh = tokens.refresh;
    this.expires = tokens.expires;
  },

  /**
   * Checks if the current tokens have expired.
   */
  expired() {
    return this.expires && epochSeconds() >= this.expires;
  },
};
