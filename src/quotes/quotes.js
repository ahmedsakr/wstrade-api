let quotes = {

    /*
     *
     */
    providers: {},

    /*
     * Load a custom provider for the exchange.
     */
    use: function (exchange, provider) {
        this.providers[exchange] = provider;
    },

    getQuote: async function (ticker) {
        return this.providers[exchange].getQuote(ticker, exchange);
    }
}

export default quotes;