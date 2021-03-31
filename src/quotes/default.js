/**
 * The default provider for quotes is Wealthsimple Trade.
 */

export default (data) => ({

  /**
     * Quote for a ticker from the Wealthsimple Trade endpoint.
     *
     * Remember that this quote is NOT real-time!
     */
  async quote(ticker) {
    const info = await data.getSecurity(ticker, true);
    return info.quote.amount;
  },
});
