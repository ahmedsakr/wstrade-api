import endpoints from '../api/endpoints';
import { handleRequest } from '../network/https';
import history from './history';
import data from '../data';
import quotes from '../quotes';

const isCanadianSecurity = (exchange) => ['TSX', 'TSX-V'].includes(exchange);

export default {

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} orderId The pending order to cancel
   */
  cancel: async (orderId) => handleRequest(endpoints.CANCEL_ORDER, { orderId }),

  /**
   * Cancels all pending orders under the WealthSimple Trade Account.
   *
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  async cancelPending(accountId) {
    const pending = await history.pending(accountId);
    return Promise.all(pending.orders.map(async (order) => this.cancel(order.order_id)));
  },

  /**
   * Market buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  marketBuy: async (accountId, ticker, quantity) => {
    const details = await data.getSecurity(ticker);

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: details.id,
      limit_price: await quotes.get(ticker),
      quantity,
      order_type: 'buy_quantity',
      order_sub_type: 'market',
      time_in_force: 'day',
      account_id: accountId,
    });
  },

  /**
   * Limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  limitBuy: async (accountId, ticker, limit, quantity) => handleRequest(endpoints.PLACE_ORDER, {
    security_id: (await data.getSecurity(ticker)).id,
    limit_price: limit,
    quantity,
    order_type: 'buy_quantity',
    order_sub_type: 'limit',
    time_in_force: 'day',
    account_id: accountId,
  }),

  /**
   * Stop limit buy a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  stopLimitBuy: async (accountId, ticker, stop, limit, quantity) => {
    const security = await data.getSecurity(ticker);

    // The WealthSimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      return Promise.reject({ reason: 'TSX/TSX-V securities must have an equivalent stop and limit price.' });
    }

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: security.id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: 'buy_quantity',
      order_sub_type: 'stop_limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  },

  /**
   * Market sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  marketSell: async (accountId, ticker, quantity) => {
    const details = await data.getSecurity(ticker);

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: details.id,
      market_value: await quotes.get(ticker),
      quantity,
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      time_in_force: 'day',
      account_id: accountId,
    });
  },

  /**
   * Limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  limitSell: async (accountId, ticker, limit, quantity) => handleRequest(endpoints.PLACE_ORDER, {
    security_id: (await data.getSecurity(ticker)).id,
    limit_price: limit,
    quantity,
    order_type: 'sell_quantity',
    order_sub_type: 'limit',
    time_in_force: 'day',
    account_id: accountId,
  }),

  /**
   * Stop limit sell a security through the WealthSimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  stopLimitSell: async (accountId, ticker, stop, limit, quantity) => {
    const security = await data.getSecurity(ticker);

    // The WealthSimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      return Promise.reject({ reason: 'TSX/TSX-V securities must have an equivalent stop and limit price.' });
    }

    return handleRequest(endpoints.PLACE_ORDER, {
      security_id: security.id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: 'sell_quantity',
      order_sub_type: 'stop_limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  },
};
