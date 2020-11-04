"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Exchanges supported by WealthSimple Trade 
const exchanges = ["NASDAQ", "NYSE", "TSX", "TSX-V"];
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
    if (typeof value === 'string') {
      let parts = value.split(':');
      this.symbol = parts[0];
      this.exchange = parts[1];
    } else {
      // This ticker will be identified with the security id - no symbol or exchange
      // stuff needed.
      if (value.hasOwnProperty('id')) {
        this.id = id;
        return;
      } // You can't form a ticker without a symbol.


      if (!value.hasOwnProperty('symbol')) {
        throw new Error(`Invalid ticker '${value}'`);
      }

      this.symbol = value.symbol; // The exchange is not needed, so no need to check if it's defined or not null.

      this.exchange = value.exchange;
    } // Guarantee that the exchange is valid if not null


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
      return `${this.symbol}${this.exchange ? `:${this.exchange}` : ''}`;
    }
  }

}

var _default = Ticker;
exports.default = _default;