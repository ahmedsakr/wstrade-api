// The maximum number of orders retrieved by the /orders API.
export const ORDERS_PER_PAGE = 20;

const defaultEndpointBehaviour = {

  // Default failure method for all endpoint calls
  onFailure: async (response) => ({
    status: response.status,
    reason: response.statusText,
    body: await response.json(),
  }),

  // Default success method for all endpoint calls
  onSuccess: async (response) => response.json(),
};

const WealthsimpleTradeEndpoints = {

  /*
   * The LOGIN endpoint intializes a new session for the given email and
   * password set. If the login is successful, access and refresh tokens
   * are returned in the headers. The access token is the key for invoking
   * all other end points.
   */
  LOGIN: {
    method: 'POST',
    url: 'https://trade-service.wealthsimple.com/auth/login',
    onSuccess: async (response) => ({
      tokens: {
        access: response.headers.get('x-access-token'),
        refresh: response.headers.get('x-refresh-token'),
        expires: parseInt(response.headers.get('x-access-token-expires'), 10),
      },

      accountInfo: await response.json(),
    }),
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Generates a new set of access and refresh tokens.
   */
  REFRESH: {
    method: 'POST',
    url: 'https://trade-service.wealthsimple.com/auth/refresh',
    onSuccess: async (response) => ({
      tokens: {
        access: response.headers.get('x-access-token'),
        refresh: response.headers.get('x-refresh-token'),
        expires: parseInt(response.headers.get('x-access-token-expires'), 10),
      },
    }),
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Grabs all account ids in this Wealthsimple Trade account.
   */
  ACCOUNT_IDS: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/account/list',
    onSuccess: async (response) => {
      const data = await response.json();

      // Collect all account ids registered under this Wealthsimple Trade Account
      return data.results.map((account) => account.id);
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * The LIST_ACCOUNT endpoint retrieves general metadata of the
   * Wealthsimple Trade account, including balances, account id, and
   * more.
   */
  LIST_ACCOUNT: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/account/list',
    onSuccess: async (response) => {
      const data = await response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * The ME endpoint retrieves some surface information about you like
   * your name and email.
   */
  ME: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/me',
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * The PERSON endpoint retrieves detailed information about you that
   * you provided on signup, like residential and mailing addresses,
   * employment, phone numbers, and so on.
   */
  PERSON: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/person',
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * The HISTORY_ACCOUNT endpoint provides historical snapshots of the
   * Wealthsimple account for a specified timeframe.
   */
  HISTORY_ACCOUNT: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/account/history/{0}?account_id={1}',
    parameters: {
      0: 'interval',
      1: 'accountId',
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Provides the most recent 20 activities (deposits, dividends, orders, etc) on the Wealthsimple
   * Trade account.
   */
  ACTIVITIES: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/account/activities',
    onSuccess: async (response) => {
      const data = await response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * All deposits under the Wealthsimple Trade account
   */
  DEPOSITS: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/deposits',
    onSuccess: async (response) => {
      const data = await response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * All linked bank accounts under the Wealthsimple Trade account
   */
  BANK_ACCOUNTS: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/bank-accounts',
    onSuccess: async (response) => {
      const data = await response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Current Wealthsimple Trade USD/CAD exchange rates
   */
  EXCHANGE_RATES: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/forex',
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Grabs information about the security resembled by the ticker.
   */
  SECURITY: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/securities?query={0}',
    parameters: {
      0: 'ticker',
    },
    onSuccess: async (response) => {
      const data = await response.json();

      if (data.results.length === 0) {
        throw new Error('Security does not exist');
      }

      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Fetches detailed information about a security using its unique
   * security identifier. Market quote, bid and ask size, and other information
   * are returned.
   */
  EXTENSIVE_SECURITY_DETAILS: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/securities/{0}',
    parameters: {
      0: 'id',
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Lists all positions under a trading account.
   */
  POSITIONS: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/account/positions?account_id={0}',
    parameters: {
      0: 'accountId',
    },
    onSuccess: async (response) => {
      const data = await response.json();
      return data.results;
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Grab a page of orders (20 orders).
   */
  ORDERS_BY_PAGE: {
    method: 'GET',
    url: 'https://trade-service.wealthsimple.com/orders?offset={0}&account_id={1}',
    parameters: {
      0: 'offset',
      1: 'accountId',
    },
    onSuccess: async (response) => {
      const data = await response.json();
      return {
        total: data.total,
        orders: data.results,
      };
    },
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Cancels a specific order by its id.
   */
  CANCEL_ORDER: {
    method: 'DELETE',
    url: 'https://trade-service.wealthsimple.com/orders/{0}',
    parameters: {
      0: 'orderId',
    },
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },

  /*
   * Places an order for a security.
   */
  PLACE_ORDER: {
    method: 'POST',
    url: 'https://trade-service.wealthsimple.com/orders',
    onSuccess: defaultEndpointBehaviour.onSuccess,
    onFailure: defaultEndpointBehaviour.onFailure,
  },
};

export default WealthsimpleTradeEndpoints;
