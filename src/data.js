import endpoints from './api/endpoints';
import Ticker from './core/ticker';
import { configEnabled } from './config';
import cache from './optional/securities-cache';

class Data {
  /**
   * Creates a new Data pbject associated with the given Https worker state.
   *
   * @param {*} httpsWorker
   */
  constructor(httpsWorker) {
    this.worker = httpsWorker;
  }

  /**
   * A snapshot of the current USD/CAD exchange rates on the Wealthsimple Trade
   * platform.
   */
  async exchangeRates() {
    return this.worker.handleRequest(endpoints.EXCHANGE_RATES, {});
  }

  /**
   * Information about a security on the Wealthsimple Trade Platform.
   *
   * @param {string|object} userTicker The security id
   * @param {boolean} extensive Pulls a more detailed report of the security using the
   *                            /securities/{id} API
   */
  async getSecurity(userTicker, extensive) {
    let result = null;

    // Run some validation on the ticker
    const ticker = new Ticker(userTicker);

    if (!extensive && configEnabled('securities_cache')) {
      result = cache.get(ticker);
      if (result) {
        return result;
      }
    }

    if (ticker.id) {
      // We will immediately call the extensive details API since we have the unique id.
      result = await this.worker.handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, {
        id: ticker.id,
      });
    } else {
      result = await this.worker.handleRequest(endpoints.SECURITY, { ticker: ticker.symbol });
      result = result.filter((security) => security.stock.symbol === ticker.symbol);

      if (ticker.crypto) {
        result = result.filter((security) => security.security_type === 'cryptocurrency');
      } else if (ticker.exchange) {
        result = result.filter((security) => security.stock.primary_exchange === ticker.exchange);
      }

      if (result.length > 1) {
        throw new Error('Multiple securities matched query.');
      } if (result.length === 0) {
        throw new Error('No securities matched query.');
      }

      // Convert result from a singleton list to its raw entry
      [result] = result;

      if (extensive) {
        // The caller has opted to receive the extensive details about the security.
        result = await this.worker.handleRequest(endpoints.EXTENSIVE_SECURITY_DETAILS, {
          id: result.id,
        });
      }
    }

    if (configEnabled('securities_cache') && cache.get(ticker) === null) {
      cache.insert(ticker, result);
    }

    return result;
  }

  /**
   * Fetches a mapping of all security groups (available on the Trade platform) to
   * their group ids.
   */
  async securityGroups() {
    const result = await this.worker.handleRequest(endpoints.SECURITY_GROUPS, {});

    // Construct a map of category name to category id
    return result.reduce((map, item) => ({
      ...map, [item.name]: item.external_security_group_id,
    }), {});
  }

  /**
   * Retrieves all securities associated with the group name or id.
   *
   * - If you provide the group name, we will automatically do a lookup
   * from the Trade servers to get its identifier.
   *
   * - Alternatively, You can get a list of all groups (with their group ids) from
   * data.groups() and provide the group identifier directly.
   *
   * @param {*} group The security group name or identifier
   */
  async getSecurityGroup(group) {
    let groupId = group;

    // Fetch the group id from the group name
    if (!group?.startsWith('security-group')) {
      const groups = await this.securityGroups();

      if (!(group in groups)) {
        throw new Error(`'${group}' is not a valid group name!`);
      }

      // record the matched group id.
      groupId = groups[group];
    }

    return this.worker.handleRequest(endpoints.SECURITY_GROUP, { groupId });
  }
}

export default Data;
