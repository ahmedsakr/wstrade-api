// Exchanges supported by WealthSimple Trade 
const exchanges = ["NASDAQ", "NYSE", "TSX", "TSX-V", "NEO"];

/**
 * Ticker provides a logical encapsulation for the allowed forms
 * of a security ticker within the WealthSimple Trade application.
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
   * @param {*} value The security ticker value, provided as a string or an object with symbol, exchange, or id.
   */
  constructor(value) {
    this.symbol = null;
    this.exchange = null;
    this.id = null;

    if (typeof(value) === 'string') {

      let parts = value.split(':');
      this.symbol = parts[0];
      this.exchange = parts[1];
    } else {

      // You need at least a symbol or id to form a ticker.
      if (!value.hasOwnProperty('symbol') && !value.hasOwnProperty('id')) {
        throw new Error(`Invalid ticker '${value}'`);
      }

      this.symbol = value.symbol;
      this.exchange = value.exchange;
      this.id = value.id;
    }

    // Guarantee that the exchange is valid if not null
    if (this.exchange && !exchanges.includes(this.exchange)) {
      throw new Error(`Invalid exchange '${this.exchange}'!`);
    }
  }

  /**
   * Reduces the ticker object to a string representation.
   */
  format() {
    if (this.id) {
      return this.id;
    } else {
      return `${this.symbol}${this.exchange ? `:${this.exchange}`: ''}`;
    }
  }

  /**
   * Compares symbol or id with another ticker. This is weak because
   * exchange is not compared here, allowing for false positives
   * of symbols on different exchanges.
   *
   * @param {*} other Ticker to compare us with
   */
  weakEquals(other) {
    return (this.id === other.id) || (this.symbol === other.symbol)
  }
}

export default Ticker;