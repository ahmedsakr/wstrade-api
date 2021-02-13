import epochSeconds from '../helpers/time';

export default {
  access: null,
  refresh: null,
  expires: null,

  /**
     *
     * @param {*} tokens
     */
  store(tokens) {
    this.access = tokens.access || this.access;
    this.refresh = tokens.refresh || this.refresh;
    this.expires = tokens.expires || this.expires;
  },

  expired() {
    return this.expires && epochSeconds() >= this.expires;
  },
};
