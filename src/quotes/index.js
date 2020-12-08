import trade from './default';
import data from '../data';

export default {

    // WealthSimple Trade is our default source for quotes, despite
    // having a 15 min delay
    defaultProvider: trade,

    // Maintains quote providers on an exchange basis
    providers: {},

    /**
     * Load a custom provider for the exchange.
     * 
     * @param {*} exchange The exchange that the provider fetches quotes for
     * @param {*} provider The provider object containing the quote() implementation.
     */
    use: function (exchange, provider) {
        if (typeof(provider.quote) != 'function') {
            
            // The provider must have a quote() implementation that we can call later!
            throw new Error(`Invalid quote provider for ${exchange}!`);
        }

        this.providers[exchange] = provider;
    },

    /**
     * Obtains a quote for the ticker. The source of the quote may be a custom
     * provider if a valid provider is registered for the exchange that the
     * ticker trades on.
     *
     * @param {*} ticker The security to get a quote for.
     */
    get: async function (ticker) {
        let exchange = null;

        // We need the exchange in the next step if the user has specified
        // a custom provider for an exchange. So if the user hasn't provided
        // it, we will have to ping WealthSimple trade to get it.
        if (ticker.exchange) {
            exchange = ticker.exchange;
        } else if (Object.keys(this.providers).length > 0) {
            let info = await data.getSecurity(ticker, false);
            exchange = info.stock.primary_exchange;
        }

        // A custom provider will take precedence over the default source
        if (this.providers.hasOwnProperty(exchange)) {
            return this.providers[exchange].quote(ticker);
        } else {
            return this.defaultProvider.quote(ticker);
        }
    }
};
