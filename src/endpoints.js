import trade from './index'
import status from 'http-status';

// The maximum number of orders retrieved by the /orders API.
export const ORDERS_PER_PAGE = 20;

// WealthSimple Trade API returns some custom HTTP codes
const wealthSimpleHttpCodes = {
  ORDER_CREATED: 201
}

// Successful HTTP codes to be used for determining the status of the request
const httpSuccessCodes = [
  status.OK,
  wealthSimpleHttpCodes.ORDER_CREATED
]

export const isSuccessfulRequest = (code) => httpSuccessCodes.includes(code);

const defaultEndpointBehaviour = {

  // Default failure method for all endpoint calls
  onFailure: async (response) => {
    return {
      status: response.status,
      reason: response.statusText,
      body: await response.json()
    }
  },

  // Default success method for all endpoint calls
  onSuccess: async (request) => await request.response.json()
}

const WealthSimpleTradeEndpoints = {

  /*
   * The LOGIN endpoint intializes a new session for the given email and
   * password set. If the login is successful, access and refresh tokens
   * are returned in the headers. The access token is the key for invoking
   * all other end points.
   */
  LOGIN: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/login",
    onSuccess: async (request) => {
      return {
        tokens: {
          access: request.response.headers.get('x-access-token'),
          refresh: request.response.headers.get('x-refresh-token')
        },

        accountInfo: await request.response.json()
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Generates a new set of access and refresh tokens.
   */
  REFRESH: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/auth/refresh",
    onSuccess: async (request) => {
      return {
        access: request.response.headers.get('x-access-token'),
        refresh: request.response.headers.get('x-refresh-token')
      }
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grabs all account ids in this WealthSimple Trade account.
   */
  ACCOUNT_IDS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: async (request) => {
      const data = await request.response.json();

      // Collect all account ids registered under this WealthSimple Trade Account
      return data.results.map(account => account.id);
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * The LIST_ACCOUNT endpoint retrieves general metadata of the
   * WealthSimple Trade account, including balances, account id, and
   * more.
   */
  LIST_ACCOUNT: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/list",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * The HISTORY_ACCOUNT endpoint provides historical snapshots of the
   * WealthSimple account for a specified timeframe.
   */
  HISTORY_ACCOUNT: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/account/history/{0}?account_id={1}",
    parameters: {
      0: "interval",
      1: "accountId"
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All deposits under the WealthSimple Trade account
   */
  DEPOSITS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/deposits",
    onSuccess: async (request) => {
      const data = await request.response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * All linked bank accounts under the WealthSimple Trade account
   */
  BANK_ACCOUNTS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/bank-accounts",
    onSuccess: async (request) => {
      const data = await request.response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Current WealthSimple Trade USD/CAD exchange rates
   */
  EXCHANGE_RATES: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/forex",
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grabs information about the security resembled by the ticker.
   */
  SECURITY: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/securities?query={0}",
    parameters: {
      0: "ticker"
    },
    onSuccess: async (request) => {
      let data = await request.response.json();

      if (data.results.length === 0) {
        return Promise.reject({
          reason: `Security does not exist`
        });
      }

      return data.results[0];
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Grab a page of orders (20 orders).
   */
  ORDERS_BY_PAGE: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?offset={0}&account_id={1}",
    parameters: {
      0: "offset",
      1: "accountId",
    },
    onSuccess: async (request) => {
      const data = await request.response.json();
      return {
        total: data.total,
        orders: data.results
      }
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Pull all orders (filled, cancelled, pending) for the specified account under
   * the WealthSimple Trade account.
   */
  ALL_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId",
    },
    onSuccess: async (request, tokens) => {
      const data = await request.response.json();
      const pages = Math.ceil(data.total / ORDERS_PER_PAGE);
      let orders = data.results;

      if (pages > 1) {

        // Query the rest of the pages
        for (let page = 2; page <= pages; page++) {
          let tmp = await trade.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push(...tmp.orders)
        }
      }

      return {
        total: orders.length,
        orders
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Filters orders by status and ticker.
   */
  FILTERED_ORDERS: {
    method: "GET",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId"
    },
    onSuccess: async (request, tokens) => {
      const data = await request.response.json();
      const pages = Math.ceil(data.total / ORDERS_PER_PAGE);

      // The ticker symbol restricts the pending orders to a specific security
      let pendingFilter = (request.arguments.ticker) ?
        order => order.symbol === request.arguments.ticker && order.status === request.arguments.status :
        order => order.status === request.arguments.status;

      let orders = data.results.filter(pendingFilter);
      if (pages > 1) {

        // Check all other pages for pending orders
        for (let page = 2; page <= pages; page++) {
          let tmp = await trade.getOrdersByPage(tokens, request.arguments.accountId, page);
          orders.push(...tmp.orders.filter(pendingFilter))
        }
      }

      return {
        total: orders.length,
        orders
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Cancels a specific order by its id.
   */
  CANCEL_ORDER: {
    method: "DELETE",
    url: "https://trade-service.wealthsimple.com/orders/{0}",
    parameters: {
      0: "orderId"
    },
    onSuccess: async (request) => {
      return {
        order: request.arguments.orderId,
        response: await request.response.json()
      }
    },
    onFailure: defaultEndpointBehaviour.onFailure
  },

  /*
   * Places an order for a security.
   */
  PLACE_ORDER: {
    method: "POST",
    url: "https://trade-service.wealthsimple.com/orders?account_id={0}",
    parameters: {
      0: "accountId"
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure
  }
}

export default WealthSimpleTradeEndpoints;