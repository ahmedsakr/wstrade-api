import endpoints, { ORDERS_PER_PAGE } from '../api/endpoints';
import { handleRequest } from '../network/https';
import Ticker from '../core/ticker';

/*
 * Retrieves orders that have the specified status.
 */
const filteredOrders = async (accountId, ticker, status) => {
    return handleRequest(endpoints.FILTERED_ORDERS, {
        accountId,
        ticker: ticker ? new Ticker(ticker) : undefined,
        status
    });
}

export default {

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} page The orders page index to seek to
   */
  page: async (accountId, page) =>
    handleRequest(endpoints.ORDERS_BY_PAGE, {
      offset: (page - 1) * ORDERS_PER_PAGE,
      accountId
    }),

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  all: async (accountId) =>
    handleRequest(endpoints.ALL_ORDERS, {
      offset: 0,
      accountId
    }),

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  pending: async (accountId, ticker) => filteredOrders(accountId, ticker, 'submitted'),
  
  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  filled: async (accountId, ticker) => filteredOrders(accountId, ticker, 'posted'),

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  cancelled: async (accountId, ticker) => filteredOrders(accountId, ticker, 'cancelled'),
};