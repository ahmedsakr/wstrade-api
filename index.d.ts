export type AuthTokens = {
    access: string,
    refresh: string
};

export type HistoryInterval = '1d'|'1w'|'1m'|'3m'|'1y';

/**
 * Identifies a security.
 *
 * @param {string} symbol The security symbol.
 * @param {string} [exchange] (optional) the exchange the security trades in
 * @param {string} [id] (optional) The internal WealthSimple Trade security ID
 */
export type SecurityIdentifier = {
    symbol: string,
    exchange?: string,
    string?: id
};

declare namespace Trade {

    // The standard failure return for all API calls
    type APIFailure = {
        status: number,
        reason: string,
        body: any
    };

    /**
     * Attempts to create a session for the provided email and password.
     *
     * @param {*} email emailed registered by the WealthSimple Trade account
     * @param {*} password The password of the account
     */
    function login(email: string, password: string): Promise<{ tokens: AuthTokens, accountInfo: any }>;

    /**
     * Generates a new set of access and refresh tokens.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function refresh(tokens: AuthTokens): Promise<AuthTokens>;

    /**
     * Appends a header name-value pair to all requests.
     *
     * @param {*} name Header key
     * @param {*} value Header value
     */
    function addHeader(name: string, value: any): void;

    /**
     * Removes a custom header from all requests.
     * 
     * @param {*} name Header key
     */
    function removeHeader(name: string): void;

    /**
     * Clears all custom headers.
     */
    function clearHeaders(): void;

    /**
     * Retrieves all account ids open under this WealthSimple Trade account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function getAccounts(tokens: AuthTokens): Promise<Array<string>>;

    /**
     * Retrieves the top-level data of the account, including account id, account types, account values, and more.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function getAccountData(tokens: AuthTokens): Promise<any>;

    /**
     * Query the history of the account within a certain time interval.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} interval The time interval for the history query
     * @param {*} accountId The account to query
     */
    function getHistory(tokens: AuthTokens, interval: HistoryInterval, accountId: string): Promise<any>;

    /**
     * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.ss
     */
    function getActivities(tokens: AuthTokens): Promise<Array<any>>;

    /**
     * Retains all bank accounts linked to the WealthSimple Trade account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function getBankAccounts(tokens: AuthTokens): Promise<Array<any>>;

    /**
     * Grab all deposit records on the WealthSimple Trade account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function getDeposits(tokens: AuthTokens): Promise<Array<any>>;

    /**
     * A snapshots of the current USD/CAD exchange rates on the WealthSimple Trade
     * platform.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     */
    function getExchangeRates(tokens: AuthTokens): Promise<any>;

    /**
     * Lists all positions in the specified trading account under the WealthSimple Trade Account.
     * 
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     */
    function getPositions(tokens: AuthTokens, accountId: string): Promise<Array<any>>;

    /**
     * Collects orders (filled, pending, cancelled) for the provided page and
     * account id.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     * @param {*} page The orders page index to seek to
     */
    function getOrdersByPage(tokens: AuthTokens, accountId: string, page: number): Promise<any>;

    /**
     * Collects all orders (filled, pending, cancelled) for the specific account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     */
    function getOrders(tokens: AuthTokens, accountId: string): Promise<any>;

    /**
     * Retrieves pending orders for the specified security in the account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function getPendingOrders(tokens: AuthTokens, accountId: string, ticker?: string | SecurityIdentifier): Promise<any>;
  
    /**
     * Retrieves filled orders for the specified security in the account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function getFilledOrders(tokens: AuthTokens, accountId: string, ticker?: string | SecurityIdentifier): Promise<any>;

    /**
     * Retrieves cancelled orders for the specified security in the account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     * @param {*} ticker (optional) The security symbol
     */
    function getCancelledOrders(tokens: AuthTokens, accountId: string, ticker?: string | SecurityIdentifier): Promise<any>;

    /**
     * Cancels the pending order specified by the order id.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} orderId The pending order to cancel
     */
    function cancelOrder(tokens: AuthTokens, orderId: string): Promise<any>;

    /**
     * Cancels all pending orders under the WealthSimple Trade Account.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The specific account in the WealthSimple Trade account
     */
    function cancelPendingOrders(tokens: AuthTokens, accountId: string): Promise<any>;


    /**
     * Information about a security on the WealthSimple Trade Platform.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {string|object} ticker The security symbol. An exchange may be added as a suffix, separated from the symbol with a colon. For example, AAPL:NASDAQ, ENB:TSX
     */
    function getSecurity(tokens: AuthTokens, ticker: string | SecurityIdentifier): Promise<any>;

    /**
     * Market buy a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} quantity The number of securities to purchase
     */
    function placeMarketBuy(tokens: AuthTokens, accountId: string, ticker: string | SecurityIdentifier, quantity: number): Promise<any>;

    /**
     * Limit buy a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} limit The maximum price to purchase the security at
     * @param {*} quantity The number of securities to purchase
     */
    function placeLimitBuy(tokens: AuthTokens,
        accountId: string, ticker: string | SecurityIdentifier, limit: number, quantity: number): Promise<any>;

    /**
     * Stop limit buy a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} stop The price at which the order converts to a limit order
     * @param {*} limit The maximum price to purchase the security at
     * @param {*} quantity The number of securities to purchase
     */
    function placeStopLimitBuy(tokens: AuthTokens,
        accountId: string, ticker: string | SecurityIdentifier, stop: number, limit: number, quantity: number): Promise<any>;

    /**
     * Market sell a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} quantity The number of securities to purchase
     */
    function placeMarketSell(tokens: AuthTokens, accountId: string, ticker: string | SecurityIdentifier, quantity: number): Promise<any>;

    /**
     * Limit sell a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} limit The minimum price to sell the security at
     * @param {*} quantity The number of securities to sell
     */
    function placeLimitSell(tokens: AuthTokens,
        accountId: string, ticker: string | SecurityIdentifier, limit: number, quantity: number): Promise<any>;

    /**
     * Stop limit sell a security through the WealthSimple Trade application.
     *
     * @param {*} tokens The access and refresh tokens returned by a successful login.
     * @param {*} accountId The account to make the transaction from
     * @param {*} ticker The security symbol
     * @param {*} stop The price at which the order converts to a limit order
     * @param {*} limit The minimum price to sell the security at
     * @param {*} quantity The number of securities to sell
     */
    function placeStopLimitSell(tokens: AuthTokens,
        accountId: string, ticker: string | SecurityIdentifier, stop: number, limit: number, quantity: number): Promise<any>;
}

export default Trade;
