// Exchanges supported by Wealthsimple Trade
// 'CC' is not an exchange; it stands for Crypto currency and
// it allows us to distinguish it from conventional securities.
const exchanges = ['NASDAQ', 'NYSE', 'TSX', 'TSX-V', 'AEQUITAS NEO EXCHANGE', 'CC'];

/**
 * Ticker provides a logical encapsulation for the allowed forms
 * of a security ticker within the Wealthsimple Trade application.
 *
 * It provides validation of the format of the ticker, and the
 * value of the exchange, if provided.
 *
 * Tickers may be specified as two data types:
 *
 * - string: The ticker may be a simple string containing the symbol, or a combination of
 * the symbol and exchange separated by a colon.
 * - object: The ticker may be an object with symbol, exchange, or id properties.
 *
 * Examples:
 *
 * "AAPL"
 * "UBER:NYSE"
 * { symbol: "AAPL" }
 * { symbol: "UBER", exchange: "NYSE" }
 * { id: "sec-s-76a7155242e8477880cbb43269235cb6" }
 */
class Ticker {
  /**
   * Constructs the ticker object.
   *
   * @param {*} value The security ticker value, provided as a string or an object with symbol,
   * exchange, or id.
   */
  constructor(value) {
    this.symbol = null;
    this.exchange = null;
    this.id = null;
    this.crypto = false;

    if (typeof (value) === 'string') {
      // Empty tickers are not allowed
      if (value === '') {
        throw new Error('Empty ticker');
      }

      [this.symbol, this.exchange] = value.split(':');
    } else {
      // You need at least a symbol or id to form a ticker.
      if (!value.symbol && !value.id) {
        throw new Error(`Invalid ticker '${value}'`);
      }

      this.symbol = value.symbol || null;
      this.exchange = value.exchange || null;
      this.id = value.id || null;
    }

    // Wealthsimple Trade doesn't have a short exchange id ('NEO') for
    // AEQUITAS NEO EXCHANGE for some reason...
    // We have to map it to the full name for comparisons to work.
    if (this.exchange === 'NEO') {
      this.exchange = 'AEQUITAS NEO EXCHANGE';
    }

    // Guarantee that the exchange is valid if not null
    if (this.exchange && !exchanges.includes(this.exchange)) {
      throw new Error(`Invalid exchange '${this.exchange}'!`);
    }

    // Set the crypto property to true to treat this security as cryptocurrency
    if (this.exchange === 'CC' || this.id?.startsWith('sec-z')) {
      this.crypto = true;
    }
  }

  /**
   * Reduces the ticker object to a string representation.
   */
  format() {
    if (this.id) {
      return this.id;
    }

    // We must retranslate the full name of the NEO exchange back to NEO
    if (this.exchange === 'AEQUITAS NEO EXCHANGE') {
      return `${this.symbol}:NEO`;
    }

    return `${this.symbol}${this.exchange ? `:${this.exchange}` : ''}`;
  }

  /**
   * Compares symbol or id with another ticker. This is weak because
   * exchange is not compared here, allowing for false positives
   * of symbols on different exchanges.
   *
   * @param {*} other Ticker to compare us with
   */
  weakEquals(other) {
    if (this.id && this.id === other.id) {
      return true;
    }

    if (this.symbol && this.symbol === other.symbol && this.crypto === other.crypto) {
      return true;
    }

    return false;
  }
}

export default Ticker;
