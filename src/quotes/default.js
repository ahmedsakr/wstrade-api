/**
 * The default provider for quotes is Wealthsimple Trade.
 */

import data from '../data';

export default {

  /**
     * Quote for a ticker from the Wealthsimple Trade endpoint.
     *
     * Remember that this quote is NOT real-time!
     */
  quote: async (ticker) => {
    const info = await data.getSecurity(ticker, true);
    return info.quote.amount;
  },
};
