import endpoints from './api/endpoints';
import { handleRequest } from './network/https';
import Ticker from './core/ticker';

export default {

  /**
   * A snapshot of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   */
  exchangeRates: async () => handleRequest(endpoints.EXCHANGE_RATES, {}),

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from the symbol
   *                               with a colon, for example: AAPL:NASDAQ, ENB:TSX
   * @param {boolean} extensive Pulls a more detailed report of the security using the /securities/{id} API
   */
  getSecurity: async (ticker, extensive) => {

    // Run some validation on the ticker
    ticker = new Ticker(ticker);

    if (ticker.id) {
      
      /*
       * There is no need to filter results based on exchange because we are given the unique id.
       * 
       * We will immediately call the extensive details API since we have the id.
       */
      return handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: ticker.id });
    }

    let queryResult = await handleRequest(endpoints.SECURITY, { ticker: ticker.symbol });
    queryResult = queryResult.filter(security => security.stock.symbol === ticker.symbol);

    if (ticker.exchange) {

      // WealthSimple Trade doesn't have a short exchange id ('NEO') for
      // AEQUITAS NEO EXCHANGE for some reason...
      // We have to map it to the full name for comparisons to work.
      if (ticker.exchange === 'NEO') {
        ticker.exchange = 'AEQUITAS NEO EXCHANGE';
      }

      queryResult = queryResult.filter(security => security.stock.primary_exchange === ticker.exchange);
    }

    if (queryResult.length > 1) {
      return Promise.reject({reason: 'Multiple securities matched query.'});
    } else if (queryResult.length === 0) {
      return Promise.reject({reason: 'No securities matched query.'});
    }

    if (extensive) {

      // The caller has opted to receive the extensive details about the security.
      return handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: queryResult[0].id });
    }

    return queryResult[0];
  },
}