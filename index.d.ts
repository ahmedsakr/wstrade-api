declare namespace Trade {


  type AuthTokens = {
    access: string,
    refresh: string,
    expires: number
  };

  // Supported exchanges
  type Exchange = 'NYSE' | 'NASDAQ' | 'TSX' | 'TSX-V' | 'NEO' | 'CC';

  /**
   * A ticker may be provided to the API as a string or an object with
   * well-defined attributes of symbol, exchange, or id.
   *
   * @param {string} symbol symbol that the security trades under.
   * @param {string} [exchange] exchange under which the security trades in
   * @param {string} [id] The internal Wealthsimple Trade security id
   */
  type Ticker = string | {
    symbol: string,
    exchange?: Exchange,
    id?: string
  };

  namespace auth {

    /**
     * Supported Auth Events at this time.
     */
    type AuthEvent = 'otp';

    /**
     * You may provide the auth event handler as the following:
     *
     * - A function (thunk): If you provide a function, this function is triggered whenever the event associated
     * with it occurs.
     *
     * - A string: Appropriate for simple value passing (e.g., providing OTP manually for logging in)
     */
    type AuthEventHandler = string | (() => Promise<string>);

    /**
     * Authentication tokens associated with your Wealthsimple Trade account.
     * 
     * The access token is good for 2 hours before it expires. The expiry time is stored in
     * this object and checked before every API call. If it has expired, the wrapper will
     * attempt to regenerate an access token using the refresh token.
     * 
     * Tip: You can store these tokens and set auth.tokens instead of logging in every single time.
     */
    let tokens: AuthTokens;

    /**
     * One-Time Passwords (OTP) are mandatory to login to your Wealthsimple Trade account.
     * However, wstrade-api does not have the ability to get the OTP token for you (for obvious reasons).
     * So, in order to successfuly login, you must provide the OTP code that wstrade-api can use to
     * complete a successful login.
     */
    const otp: AuthEventHandler;

    /**
     * Attach a handler for the event.
     *
     * @param event authentication event to handle
     * @param thunk Handler for the authentication event
     */
    function on(event: AuthEvent, thunk: AuthEventHandler): void;

    /**
     * Attempt a login with the email and password combination. A successful login
     * will populate the auth.tokens object.
     *
     * @param email Account email
     * @param password Account password
     */
    function login(email: string, password: string): Promise<void>;

    /**
     * Refreshes the access token in auth.tokens.
     * 
     * The auth.tokens.refresh token must be present for this refresh call
     * to succeed.
     */
    function refresh(): Promise<void>;
  }

  namespace headers {

    /**
     * Appends a header name-value pair to all requests.
     * 
     * @param {*} name Header key
     * @param {*} value Header value
     */
    function add(name: string, value: string): void;

    /**
     * Removes a custom header from all requests.
     * 
     * @param {*} name Header key
     */
    function remove(name: string): void;

    /**
     * Clears all custom headers.
     */
    function clear(): void;

    /**
     * Produces a list of custom headers.
     */
    function values(): Array<String>;
  }

  namespace accounts {

    /**
     * A Wealthsimple Trade account can have 4 underlying asset accounts: Personal, TFSA, RRSP, and Crypto.
     * AccountList is the object returned by the accounts.all(), associating any open account types
     * with their ids.
     * 
     * You will need these account ids to perform certain API calls like checking the positions in a specific
     * account.
     */
    type AccountList = {
      personal?: string,
      tfsa?: string,
      rrsp?: string,
      crypto?: string,
    };

    /**
     * The set of time intervals that are supported by the accounts.history() API call.
     */
    type HistoryInterval = '1d' | '1w' | '1m' | '3m' | '1y';

    /**
     * Retrieves all open account ids under this Wealthsimple Trade account.
     */
    function all(): Promise<AccountList>;

    /**
     * Retrieves the top-level data of the account, including Wealthsimple Trade account id, account types,
     * account values, and more.
     */
    function data(): Promise<any>;

    /**
     * Retrieves some surface information about you like your name and email, account
     * signatures, and other metadata.
     */
    function me(): Promise<any>;

    /**
     * Detailed information about you that you provided on signup, like residential and
     * mailing addresses, employment, phone numbers, and so on.
     */
    function person(): Promise<any>;

    /**
     * Query the history of the account within a certain time interval.
     *
     * @param {*} interval The time interval for the history query
     * @param {*} accountId The account to grab history for
     */
    function history(interval: HistoryInterval, accountId: string): Promise<any>;

    /**
     * Retrieves the most recent 20 activities on the Wealthsimple Trade Account.
     */
    function activities(): Promise<any>;

    /**
     * Retrieves all bank accounts linked to the Wealthsimple Trade account.
     */
    function getBankAccounts(): Promise<any>;

    /**
     * Grab all deposit records on the Wealthsimple Trade account.
     */
    function deposits(): Promise<any>;

    /**
     * Lists all positions in the specified trading account under the Wealthsimple Trade Account.
     * 
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     */
    function positions(accountId: string): Promise<any>;
  }

  namespace orders {

    /**
     * Collects orders (filled, pending, cancelled) for the provided page and
     * account id.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     * @param {*} page The orders page index to seek to
     */
    function page(accountId: string, page: number): Promise<any>;

    /**
     * Collects all orders (filled, pending, cancelled) for the specific account.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     */
    function all(accountId: string): Promise<any>;

    /**
     * Retrieves pending orders for the specified security in the account.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function pending(accountId: string, ticker?: Ticker): Promise<any>;

    /**
     * Retrieves filled orders for the specified security in the account.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function filled(accountId: string, ticker?: Ticker): Promise<any>;

    /**
     * Retrieves cancelled orders for the specified security in the account.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function cancelled(accountId: string, ticker?: Ticker): Promise<any>;

    /**
     * Cancels the pending order specified by the order id.
     *
     * @param {*} orderId The pending order to cancel
     */
    function cancel(orderId: string): Promise<any>;

    /**
     * Cancels all pending orders under the open account specified by accountId.
     *
     * @param {*} accountId The specific account in the Wealthsimple Trade account
     */
    function cancelPending(accountId: string): Promise<any>;

    /**
     * Purchase a security with a market order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} quantity The number of securities to purchase
     */
    function marketBuy(accountId: string, ticker: Ticker, quantity: number): Promise<any>;

    /**
     * Purchase a security with a limit order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} limit The maximum price to purchase the security at
     * @param {*} quantity The number of securities to purchase
     */
    function limitBuy(accountId: string, ticker: Ticker, limit: number, quantity: number): Promise<any>;

    /**
     * Purchase a security with a stop limit order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} stop The price at which the order converts to a limit order
     * @param {*} limit The maximum price to purchase the security at
     * @param {*} quantity The number of securities to purchase
     */
    function stopLimitBuy(accountId: string, ticker: Ticker, stop: number, limit: number, quantity: number): Promise<any>;

    /**
     * Sell a security with a market order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} quantity The number of securities to purchase
     */
    function marketSell(accountId: string, ticker: Ticker, quantity: number): Promise<any>;

    /**
     * Sell a security with a limit order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} limit The minimum price to sell the security at
     * @param {*} quantity The number of securities to sell
     */
    function limitSell(accountId: string, ticker: Ticker, limit: number, quantity: number): Promise<any>;

    /**
     * Sell a security with a stop limit order.
     *
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} stop The price at which the order converts to a limit order
     * @param {*} limit The minimum price to sell the security at
     * @param {*} quantity The number of securities to sell
     */
    function stopLimitSell(accountId: string, ticker: Ticker, stop: number, limit: number, quantity: number): Promise<any>;
  }

  namespace quotes {

    /**
     * The quotes module provides support for customizing the source of quotes
     * for specified exchanges through the QuoteProvider type.
     * 
     * Pass a QuoteProvider object to quotes.use(), and your custom quote provider
     * will be used for the exchange you enable it for.
     */
    type QuoteProvider = {
      quote: (ticker: Ticker) => Promise<number>;
    };

    /**
     * Wealthsimple Trade is our default quote provider for all exchanges,
     * despite having a 15-minute delay.
     */
    const defaultProvider: QuoteProvider;

    /**
     * Load a custom provider for the exchange.
     * 
     * @param {*} exchange The exchange that the provider fetches quotes for
     * @param {*} provider The provider object containing the quote() implementation.
     */
    function use(exchange: Exchange, provider: QuoteProvider): void;

    /**
     * Obtains a quote for the ticker. The source of the quote may be a custom
     * provider if a valid provider is registered for the exchange that the
     * ticker trades on.
     *
     * @param {*} ticker The security to get a quote for.
     */
    function get(ticker: Ticker): Promise<number>;
  }

  namespace data {

    /**
     * A snapshot of the current USD/CAD exchange rates on the Wealthsimple Trade
     * platform.
     */
    function exchangeRates(): Promise<any>;

    /**
     * Information about a security on the Wealthsimple Trade Platform.
     *
     * @param {Ticker} ticker The security symbol.
     * @param {boolean} extensive Pulls a more detailed report of the security using the /securities/{id} API
     */
    function getSecurity(ticker: Ticker, extensive?: boolean): Promise<any>;
  }


  /**
   * Enable or disable an optional feature within wstrade-api.
   * 
   * Examples:
   * ---
   * config('pancakes')
   * Enables the fictitious pancakes feature.
   * 
   * config('no_pancakes')
   * Disables the fictitious pancakes feature.
   *
   * @param {*} feature The string identifier for the feature, starting with "no_" if
   *                    you wish to disable it.
   */
  function config(feature: string): void;

}

export = Trade;