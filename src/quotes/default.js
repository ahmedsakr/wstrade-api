/**
 * The default provider for quotes is WealthSimple Trade.
 */

import data from '../data';

export default {

    /**
     * Quote for a ticker from the WealthSimple Trade endpoint.
     *
     * Remember that this quote is NOT real-time!
     */
    quote: async (ticker) => {
        let info = await data.getSecurity(ticker, true);
        return info.quote.amount;
    }
}