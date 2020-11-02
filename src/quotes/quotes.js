let quotes = {

    /*
     *
     */
    providers: {
        nyse: null,
        nasdaq: null,
        tsx: null,
        tsxv: null
    },

    /*
     * Load a custom provider for the exchange.
     */
    use: function (exchange, provider) {
        this.providers[exchange] = require(`./external/${provider}`).default;
    },

    getQuote: async function (ticker, exchange) {
        return this.providers[exchange].getQuote(ticker, exchange);
    }
}

export default quotes;