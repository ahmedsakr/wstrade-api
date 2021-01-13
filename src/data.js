import endpoints from './api/endpoints';
import { handleRequest } from './network/https';
import Ticker from './core/ticker';
import { configEnabled } from './config';
import cache from './optional/securities-cache';

export default {

  /**
   * A snapshot of the current USD/CAD exchange rates on the WealthSimple Trade
   * platform.
   */
  exchangeRates: async () => handleRequest(endpoints.EXCHANGE_RATES, {}),

  /**
   * Information about a security on the WealthSimple Trade Platform.
   *
   * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from
   *                               the symbol with a colon, for example: AAPL:NASDAQ, ENB:TSX
   * @param {boolean} extensive Pulls a more detailed report of the security using the
   *                            /securities/{id} API
   */
  getSecurity: async (ticker, extensive) => {
    let result = null;

    // Run some validation on the ticker
    ticker = new Ticker(ticker);

    if (!extensive && configEnabled('securities_cache')) {
      result = cache.get(ticker);
      if (result) {
        return result;
      }
    }

    if (ticker.id) {
      // We will immediately call the extensive details API since we have the unique id.
      result = await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: ticker.id });
    } else {
      result = await handleRequest(endpoints.SECURITY, { ticker: ticker.symbol });
      result = result.filter((security) => security.stock.symbol === ticker.symbol);

      if (ticker.exchange) {
        result = result.filter((security) => security.stock.primary_exchange === ticker.exchange);
      }

      if (result.length > 1) {
        return Promise.reject({ reason: 'Multiple securities matched query.' });
      } if (result.length === 0) {
        return Promise.reject({ reason: 'No securities matched query.' });
      }

      result = result[0];

      if (extensive) {
        // The caller has opted to receive the extensive details about the security.
        result = await handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, { id: result.id });
      }
    }

    if (configEnabled('securities_cache') && cache.get(ticker) === null) {
      cache.insert(ticker, result);
    }

    return result;
  },
};
