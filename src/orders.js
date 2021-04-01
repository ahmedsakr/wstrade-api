import endpoints from './api/endpoints';
import Ticker from './core/ticker';

// The maximum number of orders retrieved by the /orders API.
const ORDERS_PER_PAGE = 20;

const isCanadianSecurity = (exchange) => ['TSX', 'TSX-V'].includes(exchange);

/*
 * Retrieve filtered orders by ticker and status.
 */
function filteredOrders(list, ticker, status) {
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
  const filtered = list.orders.filter(orderFilter);

  return {
    orders: filtered,
    total: filtered.length,
  };
}

class Orders {
  /**
   * Createw a new OrderHistory object associated with an Https worker state.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker, data) {
    this.worker = httpsWorker;
    this.data = data;
  }

  /**
   * Collects orders (filled, pending, cancelled) for the provided page and
   * account id.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   * @param {*} pageNum The orders page index to seek to
   */
  async page(accountId, pageNum) {
    return this.worker.handleRequest(endpoints.ORDERS_BY_PAGE, {
      offset: (pageNum - 1) * ORDERS_PER_PAGE,
      accountId,
    });
  }

  /**
   * Collects all orders (filled, pending, cancelled) for the specific account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   */
  async all(accountId) {
    // We start by capturing the first page of orders in order to
    // determine the number of pages available
    const data = await this.page(accountId, 1);
    const pages = Math.ceil(data.total / ORDERS_PER_PAGE);

    if (pages > 1) {
      const tasks = [];

      // Build the task queue that will retrieve the remaining pages of orders
      for (let pageNum = 2; pageNum <= pages; pageNum++) {
        tasks.push(this.page(accountId, pageNum).then((result) => result.orders));
      }

      // Out-of-order invocation is desired. What matters is that Promise.all will
      // guarantee that the data order is preserved.
      const result = await Promise.all(tasks);
      result.forEach((list) => data.orders.push(...list));

      // Update the total attribute to reflect the new size
      data.total = data.orders.length;
    }

    return data;
  }

  /**
   * Retrieves pending orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  async pending(accountId, ticker) {
    const orders = await this.all(accountId);
    return filteredOrders(orders, ticker, 'submitted');
  }

  /**
   * Retrieves filled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  async filled(accountId, ticker) {
    const orders = await this.all(accountId);
    return filteredOrders(orders, ticker, 'posted');
  }

  /**
   * Retrieves cancelled orders for the specified security in the account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   * @param {*} ticker (optional) The security symbol
   */
  async cancelled(accountId, ticker) {
    const orders = await this.all(accountId);
    return filteredOrders(orders, ticker, 'cancelled');
  }

  /**
   * Cancels the pending order specified by the order id.
   *
   * @param {*} orderId The pending order to cancel
   */
  async cancel(orderId) {
    return {
      order: orderId,
      response: await this.worker.handleRequest(endpoints.CANCEL_ORDER, { orderId }),
    };
  }

  /**
   * Cancels all pending orders under the Wealthsimple Trade Account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   */
  async cancelPending(accountId) {
    const pending = await this.pending(accountId);
    return Promise.all(pending.orders.map(async (order) => this.cancel(order.order_id)));
  }

  /**
   * Market buy a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  async marketBuy(accountId, ticker, quantity) {
    const details = await this.data.getSecurity(ticker, true);

    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: details.id,
      limit_price: !(new Ticker(ticker).crypto) ? details.quote.amount : undefined,
      quantity,
      order_type: 'buy_quantity',
      order_sub_type: 'market',
      time_in_force: 'day',
      account_id: accountId,
    });
  }

  /**
   * Limit buy a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  async limitBuy(accountId, ticker, limit, quantity) {
    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await this.data.getSecurity(ticker)).id,
      limit_price: limit,
      quantity,
      order_type: 'buy_quantity',
      order_sub_type: 'limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  }

  /**
   * Stop limit buy a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The maximum price to purchase the security at
   * @param {*} quantity The number of securities to purchase
   */
  async stopLimitBuy(accountId, ticker, stop, limit, quantity) {
    const security = await this.data.getSecurity(ticker);

    // The Wealthsimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      throw new Error('TSX/TSX-V securities must have an equivalent stop and limit price.');
    }

    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: security.id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: 'buy_quantity',
      order_sub_type: 'stop_limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  }

  /**
   * Market sell a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} quantity The number of securities to purchase
   */
  async marketSell(accountId, ticker, quantity) {
    const details = await this.data.getSecurity(ticker, true);

    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: details.id,
      market_value: !(new Ticker(ticker).crypto) ? details.quote.amount : undefined,
      quantity,
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      time_in_force: 'day',
      account_id: accountId,
    });
  }

  /**
   * Limit sell a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  async limitSell(accountId, ticker, limit, quantity) {
    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: (await this.data.getSecurity(ticker)).id,
      limit_price: limit,
      quantity,
      order_type: 'sell_quantity',
      order_sub_type: 'limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  }

  /**
   * Stop limit sell a security through the Wealthsimple Trade application.
   *
   * @param {*} accountId The account to make the transaction from
   * @param {*} ticker The security symbol
   * @param {*} stop The price at which the order converts to a limit order
   * @param {*} limit The minimum price to sell the security at
   * @param {*} quantity The number of securities to sell
   */
  async stopLimitSell(accountId, ticker, stop, limit, quantity) {
    const security = await this.data.getSecurity(ticker);

    // The Wealthsimple Trade backend doesn't check for this, even though the app does..
    if (isCanadianSecurity(security.stock.primary_exchange) && stop !== limit) {
      throw new Error('TSX/TSX-V securities must have an equivalent stop and limit price.');
    }

    return this.worker.handleRequest(endpoints.PLACE_ORDER, {
      security_id: security.id,
      stop_price: stop,
      limit_price: limit,
      quantity,
      order_type: 'sell_quantity',
      order_sub_type: 'stop_limit',
      time_in_force: 'day',
      account_id: accountId,
    });
  }
}

export default Orders;
