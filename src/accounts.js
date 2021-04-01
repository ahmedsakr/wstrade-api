import endpoints from './api/endpoints';

// The maximumum number of activities we can pull in one go.
const ACTIVITIES_MAX_DRAW = 99;
// Supported activity types
const ACTIVITIES_TYPES_ALL = [
  'sell',
  'deposit',
  'withdrawal',
  'dividend',
  'institutional_transfer',
  'internal_transfer',
  'refund',
  'referral_bonus',
  'affiliate',
  'buy',
];

class Accounts {
  /**
   * Creates a new Account object associated with an Https worker state.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker) {
    this.worker = httpsWorker;
  }

  /**
   * Retrieves all account ids open under this Wealthsimple Trade account.
   */
  async all() {
    const accounts = await this.worker.handleRequest(endpoints.ACCOUNT_IDS, {});

    return {
      tfsa: accounts.find((account) => account.startsWith('tfsa')),
      rrsp: accounts.find((account) => account.startsWith('rrsp')),
      crypto: accounts.find((account) => account.startsWith('non-registered-crypto')),
      personal: accounts.find((account) => account.startsWith('non-registered') && !account.startsWith('non-registered-crypto')),
    };
  }

  /**
   * Returns a list of details about your open accounts, like account type, buying power,
   * current balance, and more.
   */
  async data() {
    return this.worker.handleRequest(endpoints.LIST_ACCOUNT, {});
  }

  /**
   * Retrieves some surface information about you like your name and email, account
   * signatures, and other metadata.
   */
  async me() {
    return this.worker.handleRequest(endpoints.ME, {});
  }

  /**
   * Detailed information about you that you provided on signup, like residential and
   * mailing addresses, employment, phone numbers, and so on.
   */
  async person() {
    return this.worker.handleRequest(endpoints.PERSON, {});
  }

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  async history(interval, accountId) {
    return this.worker.handleRequest(endpoints.HISTORY_ACCOUNT, { interval, accountId });
  }

  /**
   * Fetches activities on your Wealthsimple Trade account. You can limit number of activities
   * to fetch or refine what activities are fetched based on activity type (e.g., buy, sell),
   * account (e.g., tfsa, rrsp).
   */
  async activities(filters = {}) {
    // The maximum draw per API call is 99. If it's higher, we must abort.
    if (filters?.limit && filters.limit > ACTIVITIES_MAX_DRAW) {
      throw new Error('filters.limit can not exceed 99! Leave filters.limit undefined if you want to retrieve all.');
    }

    // Tell the user that filter.accounts must be an error
    if (filters?.accounts && !Array.isArray(filters.accounts)) {
      throw new Error('filters.accounts must be an array!');
    }

    // Tell the user that filter.type must be an error
    if (filters?.type && !Array.isArray(filters.type)) {
      throw new Error('filters.type must be an array!');
    }

    const results = [];

    // Draw the first set of activities
    let response = await this.worker.handleRequest(endpoints.ACTIVITIES, {
      limit: filters?.limit ?? ACTIVITIES_MAX_DRAW,
      accountIds: filters?.accounts?.join() ?? '',
      bookmark: '',
      type: filters?.type ?? ACTIVITIES_TYPES_ALL,
    });
    results.push(...response.results);

    /*
     * To get all activities, we will have to draw the maximum number
     * of activities per API call until we are done (i.e., when we
     * receive a number of activities less than the maximum per draw)
     */
    if (!filters?.limit) {
      /*
       * The no-await-in-loop rule is being disabled for this case because
       * every loop feeds back into the next one with the bookmark (i.e., they
       * are not independent and must run sequentially).
       */
      /* eslint-disable no-await-in-loop */
      while (results.length % ACTIVITIES_MAX_DRAW === 0) {
        response = await this.worker.handleRequest(endpoints.ACTIVITIES, {
          limit: ACTIVITIES_MAX_DRAW,
          accountIds: filters?.accounts?.join() ?? '',
          bookmark: response.bookmark,
          type: filters?.type ?? ACTIVITIES_TYPES_ALL,
        });

        // Escape the loop if the returned results is empty. This means we have reached the end.
        if (response.results.length === 0) {
          break;
        }

        results.push(...response.results);
      }
      /* eslint-enable no-await-in-loop */
    }

    return results;
  }

  /**
   * Retrieves all bank accounts linked to the Wealthsimple Trade account.
   */
  async getBankAccounts() {
    return this.worker.handleRequest(endpoints.BANK_ACCOUNTS, {});
  }

  /**
   * Grab all deposit records on the Wealthsimple Trade account.
   */
  async deposits() {
    return this.worker.handleRequest(endpoints.DEPOSITS, {});
  }

  /**
   * Lists all positions in the specified trading account under the Wealthsimple Trade Account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   */
  async positions(accountId) {
    return this.worker.handleRequest(endpoints.POSITIONS, { accountId });
  }
}

export default Accounts;
