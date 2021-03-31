import TradeQuotes from './default';
import Ticker from '../core/ticker';
import endpoints from '../api/endpoints';

class Quotes {
  /**
   * Creates a new Quotes object associated with the given HTTPS Worker state.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker, data) {
    // Wealthsimple Trade is our default source for quotes, despite
    // having a 15 min delay
    this.defaultProvider = new TradeQuotes(data);

    // Maintains quote providers on an exchange basis
    this.providers = {};

    this.worker = httpsWorker;
    this.data = data;
  }

  /**
     * Load a custom provider for the exchange.
     *
     * @param {*} exchange The exchange that the provider fetches quotes for
     * @param {*} provider The provider object containing the quote() implementation.
     */
  use(exchange, provider) {
    if (typeof (provider.quote) !== 'function') {
      // The provider must have a quote() implementation that we can call later!
      throw new Error(`Invalid quote provider for ${exchange}!`);
    }

    this.providers[exchange] = provider;
  }

  /**
     * Obtains a quote for the ticker. The source of the quote may be a custom
     * provider if a valid provider is registered for the exchange that the
     * ticker trades on.
     *
     * @param {*} security The security to get a quote for.
     */
  async get(security) {
    let exchange = null;
    const ticker = new Ticker(security);

    if (ticker.exchange) {
      // We need the exchange in the next step if the user has specified
      // a custom provider for an exchange. So if the user hasn't provided
      // it, we will have to ping Wealthsimple trade to get it.
      exchange = ticker.exchange;
    } else if (ticker.crypto && ticker.id) {
      // If the id is only given but we know it's a crypto id,
      // we will automatically set exchange to 'CC'.
      exchange = 'CC';
    } else if (Object.keys(this.providers).length > 0) {
      const info = await this.data.getSecurity(ticker, false);
      exchange = info.stock.primary_exchange;
    }

    // A custom provider will take precedence over the default source
    if (exchange in this.providers) {
      return this.providers[exchange].quote(ticker);
    }

    return this.defaultProvider.quote(ticker);
  }

  /**
   * Retrieves the historical quotes within a specified interval for the ticker.
   * The source of the historical data is not customizable at this time because
   * there is no need for it to be so.
   *
   * @param {*} ticker The ticker to search historical quotes for
   * @param {*} interval The time range of the quotes
   */
  async history(security, interval) {
    // validate the user-given security
    const ticker = new Ticker(security);
    if (!ticker.id) {
      ticker.id = (await this.data.getSecurity(ticker)).id;
    }

    return this.worker.handleRequest(endpoints.QUOTES_HISTORY, { id: ticker.id, interval });
  }
}

export default Quotes;
