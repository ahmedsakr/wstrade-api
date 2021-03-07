import endpoints from './api/endpoints';
import handleRequest from './network/https';

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

export default {

  /**
   * Retrieves all account ids open under this Wealthsimple Trade account.
   */
  all: async () => {
    const accounts = await handleRequest(endpoints.ACCOUNT_IDS, {});

    return {
      tfsa: accounts.find((account) => account.startsWith('tfsa')),
      rrsp: accounts.find((account) => account.startsWith('rrsp')),
      crypto: accounts.find((account) => account.startsWith('non-registered-crypto')),
      personal: accounts.find((account) => account.startsWith('non-registered') && !account.startsWith('non-registered-crypto')),
    };
  },

  /**
   * Returns a list of details about your open accounts, like account type, buying power,
   * current balance, and more.
   */
  data: async () => handleRequest(endpoints.LIST_ACCOUNT, {}),

  /**
   * Retrieves some surface information about you like your name and email, account
   * signatures, and other metadata.
   */
  me: async () => handleRequest(endpoints.ME, {}),

  /**
   * Detailed information about you that you provided on signup, like residential and
   * mailing addresses, employment, phone numbers, and so on.
   */
  person: async () => handleRequest(endpoints.PERSON, {}),

  /**
   * Query the history of the account within a certain time interval.
   *
   * @param {*} interval The time interval for the history query
   * @param {*} accountId The account to query
   */
  history: async (interval, accountId) => handleRequest(endpoints.HISTORY_ACCOUNT, {
    interval, accountId,
  }),

  /**
   * Retrieves the most recent 20 activities on the Wealthsimple Trade Account.
   */
  activities: async (filters = {}) => {
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
    let response = await handleRequest(endpoints.ACTIVITIES, {
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
        response = await handleRequest(endpoints.ACTIVITIES, {
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
  },

  /**
   * Retrieves all bank accounts linked to the Wealthsimple Trade account.
   */
  getBankAccounts: async () => handleRequest(endpoints.BANK_ACCOUNTS, {}),

  /**
   * Grab all deposit records on the Wealthsimple Trade account.
   */
  deposits: async () => handleRequest(endpoints.DEPOSITS, {}),

  /**
   * Lists all positions in the specified trading account under the Wealthsimple Trade Account.
   *
   * @param {*} accountId The specific account in the Wealthsimple Trade account
   */
  positions: async (accountId) => handleRequest(endpoints.POSITIONS, { accountId }),
};
