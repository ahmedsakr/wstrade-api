import endpoints from './api/endpoints';
import { handleRequest } from './network/https';

export default {

  /**
   * Retrieves all account ids open under this WealthSimple Trade account.
   */
  all: async () => {
      let accounts = await handleRequest(endpoints.ACCOUNT_IDS, {});

      return {
        tfsa: accounts.find(account => account.startsWith('tfsa')),
        rrsp: accounts.find(account => account.startsWith('rrsp')),
        crypto: accounts.find(account => account.startsWith('non-registered-crypto')),
        personal: accounts.find(account => account.startsWith('non-registered') && !account.startsWith('non-registered-crypto')),
      };
  },

  /**
   * Retrieves the top-level data of the account, including account id, account types, account values, and more.
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
  history: async (interval, accountId) => handleRequest(endpoints.HISTORY_ACCOUNT, { interval, accountId }),
  
  /**
   * Retrieves the most recent 20 activities on the WealthSimple Trade Account.
   *
   */
  activities: async () => handleRequest(endpoints.ACTIVITIES, {}),

  /**
   * Retrieves all bank accounts linked to the WealthSimple Trade account.
   */
  getBankAccounts: async () => handleRequest(endpoints.BANK_ACCOUNTS, {}),

  /**
   * Grab all deposit records on the WealthSimple Trade account.
   */
  deposits: async () => handleRequest(endpoints.DEPOSITS, {}),

  /**
   * Lists all positions in the specified trading account under the WealthSimple Trade Account.
   * 
   * @param {*} accountId The specific account in the WealthSimple Trade account
   */
  positions: async (accountId) => handleRequest(endpoints.POSITIONS, { accountId }),
};