import endpoints, { ORDERS_PER_PAGE } from '../api/endpoints';
import { handleRequest } from '../network/https';
import Ticker from '../core/ticker';

/**
 * Collects orders (filled, pending, cancelled) for the provided page and
 * account id.
 *
 * @param {*} accountId The specific account in the WealthSimple Trade account
 * @param {*} pageNum The orders page index to seek to
 */
async function page(accountId, pageNum) {
  return handleRequest(endpoints.ORDERS_BY_PAGE, {
    offset: (pageNum - 1) * ORDERS_PER_PAGE,
    accountId,
  });
}

/**
 * Collects all orders (filled, pending, cancelled) for the specific account.
 *
 * @param {*} accountId The specific account in the WealthSimple Trade account
 */
async function all(accountId) {
  // We start by capturing the first page of orders in order to
  // determine the number of pages available
  const data = await page(accountId, 1);
  const pages = Math.ceil(data.total / ORDERS_PER_PAGE);

  if (pages > 1) {
    const tasks = [];
    // Query the rest of the pages
    for (let pageNum = 2; pageNum <= pages; pageNum++) {
      tasks.push(page(accountId, pageNum).then((result) => result.orders));
    }

    // Out-of-order invocation is desired. What matters is that Promise.all will
    // guarantee that the data order is preserved.
    const result = await Promise.all(tasks);
    result.forEach((list) => data.orders.push(...list));
  }

  return {
    total: data.orders.length,
    orders: data.orders,
  };
}

/*
 * Retrieve filtered orders by ticker and status.
 */
async function filteredOrders(accountId, ticker, status) {
  // Fetch all orders
  const result = await all(accountId);

  const orderFilter = (order) => {
    if (ticker) {
      const target = new Ticker({ symbol: order.symbol, id: order.security_id });
      // order objects don't include exchanges, so we are unable to make
      // a strong comparison without requiring a linear increase of
      // endpoint calls (which is not reasonable).
      //
      // The user should provide the security id for a strong comparison here.
      if (!new Ticker(ticker).weakEquals(target)) {
        return false;
      }
    }

    return order.status === status;
  };

  // Apply filter to the result
  result.orders = result.orders.filter(orderFilter);
  result.total = result.orders.length;
  return result;
}

export default {

  page,
  all,

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
