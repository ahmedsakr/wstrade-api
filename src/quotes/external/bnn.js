import fetch from 'node-fetch';

/*
 * DISCLAIMER:
 * ---
 * 
 * This implementation is provided with no guarantee to the data it retrieves.
 * BNN is an external entity and this file has no control over the integrity of
 * the data received. Use at your own risk.
 */


const BNN_ENDPOINT = "https://data.bnn.ca/dispenser/hydra/dapi/stockChart?s="

/*
 * BNN (Bloomberg) provides near real-time quotes for U.S. equities.
 */
const bnn = {

    // Supported exchanges
    exchanges: ['NYSE', 'NASDAQ', 'TSX'],

    // Exchanges that BNN can provide near real-time quotes for.
    realtime: ['NYSE', 'NASDAQ'],

    /*
     *
     */
    getQuote: async function (ticker, exchange) {

        let headers = new fetch.Headers();
        headers.append('Referer', 'https://www.bnnbloomberg.ca/');

        let response = await fetch(`${BNN_ENDPOINT}${ticker}:${exchange}`, {
            body: undefined,
            method: "GET",
            headers
        });

        return (await response.json()).data.stocks[0].price;
    }
}

export default bnn;