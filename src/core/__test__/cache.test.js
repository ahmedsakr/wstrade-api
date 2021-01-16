import APICache from '../cache';

const cache = new APICache(10);

// Confirm the constructor set the cache size appropriately
test('Cache size', () => {
  expect(cache.size).toBe(10);
});

// Entry that doesn't exist should return undefined
test('Cache get for missing entries', () => {
  expect(cache.get('AAPL')).toBe(undefined);
});

// A bag of 10 securities that we will be inserting into the cache
const tenSecurities = ['AAPL', 'UBER:NYSE', 'UBER', 'TSLA', 'BB', 'SU', 'BTC', 'AC:TSX', 'TD', 'CGX'];

// Insert a trivial object into the cache for each security
test('Cache insert until capacity reached', () => {
  tenSecurities.forEach((security) => cache.insert(security, { id: security }));
  tenSecurities.forEach((security) => expect(cache.get(security)).toStrictEqual({ id: security }));
});

// Our cache is at capacity with 10 entries. If we try adding a new entry,
// the first entry is expected to be evicted.
test('Cache evicts first entry', () => {
  expect(cache.get('AAPL')).toStrictEqual({ id: 'AAPL' });

  // Inserting VEQT should kick out AAPL, which was our first entry.
  cache.insert('VEQT', { id: 'VEQT' });

  expect(cache.get('VEQT')).toStrictEqual({ id: 'VEQT' });
  expect(cache.get('AAPL')).toBe(undefined);
});
