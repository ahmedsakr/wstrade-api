import APICache from '../core/cache';
import Ticker from '../core/ticker';

let cache = new APICache(10);

export default {
    /**
     * Query the cache for the security.
     *
     * @param {*} security 
     */
    get(security) {

        // Must digest the security into the standard format
        let result = cache.get(new Ticker(security).format());

        if (result === undefined) {
            return null;
        }

        return result;
    },

    /**
     * Remember the security for a future quick retrieval.
     *
     * @param {*} key 
     * @param {*} value 
     */
    insert(key, value) {
        cache.insert(new Ticker(key).format(), value);
    }
}