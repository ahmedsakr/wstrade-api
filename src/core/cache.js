/*
 * APICache is an internal effort to minimize unnecessary API calls where
 * possible. A specific usecase where a cache is useful is figuring out the
 * exchange a security belongs to. A cache would allow us to memorize
 * this static data for a period of time to avoid unnecessary API calls.
 * 
 * The class encapsulates the following cache behaviour:
 * - A maximum entries provided as a constructor argument
 * - First in, First out (FIFO) model
 * 
 * The internel data structure is a HashSet, so lookup time cost is fairly
 * minimal.
 */
export default class APICache {

    constructor(size) {
        this.cache = new Map();
        this.size = size;
    }

    insert(key, value) {
        if (this.cache.size >= this.size) {
            this.cache.delete(this.cache.keys().next());
        }

        this.cache.set(key, value);
    }

    get(key) {
        return this.cache.get(key);
    }
}