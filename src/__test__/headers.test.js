import headers from '../headers';

const stubHeaders = [];

/*
 * Create a stub Headers constructor for node-fetch so we can
 * eliminate this external dependency when testing the headers
 * module.
 */
jest.mock('node-fetch', () => ({
  Headers: () => ({
    append: (name, value) => stubHeaders.push([name, value]),
    delete: (name) => stubHeaders.forEach((item, id) => {
      if (name === item[0]) {
        stubHeaders.splice(id, 1);
      }
    }),
    [Symbol.iterator]: () => stubHeaders[Symbol.iterator](),
  }),
}));

// Reset the headers list before every test case to avoid
// any side effects from one test to the ext.
beforeEach(() => {
  // clear the array
  stubHeaders.length = 0;
});

// Confirm correct insertion of header key-value pair
test('headers.add accepts key-value pair', () => {
  headers.add('Content-Type', 'application/json');

  expect(stubHeaders.length).toBe(1);
  expect(stubHeaders[0]).toStrictEqual(['Content-Type', 'application/json']);
});

// headers.add should relay all key-value pairs to be stored
test('several invocations on headers.add stores all custom headers', () => {
  headers.add('Content-Type', 'application/json');
  headers.add('Content-Encoding', 'gzip');
  headers.add('Keep-Alive', 'timeout=5, max=1000');

  expect(stubHeaders.length).toBe(3);
  expect(stubHeaders[0]).toStrictEqual(['Content-Type', 'application/json']);
  expect(stubHeaders[1]).toStrictEqual(['Content-Encoding', 'gzip']);
  expect(stubHeaders[2]).toStrictEqual(['Keep-Alive', 'timeout=5, max=1000']);
});

// removing a non-existant key-value pair should not cause any problems
test('headers.remove with key that is not stored', () => {
  expect(stubHeaders.length).toBe(0);
  headers.remove('Content-Type');
  expect(stubHeaders.length).toBe(0);
});

// removing an existing key-value pair will delete it from the list
test('headers.remove with key that is stored', () => {
  headers.add('Content-Type', 'application/json');
  expect(stubHeaders.length).toBe(1);
  expect(stubHeaders[0]).toStrictEqual(['Content-Type', 'application/json']);

  headers.remove('Content-Type');
  expect(stubHeaders.length).toBe(0);
});

// headers.clear should reset us back to empty list
test('headers.clear wipes out all entries', () => {
  headers.add('Content-Type', 'application/json');
  headers.add('Content-Encoding', 'gzip');
  headers.add('Keep-Alive', 'timeout=5, max=1000');

  expect(stubHeaders.length).toBe(3);

  headers.clear();
  expect(stubHeaders.length).toBe(0);
});

// headers.values return a list of all key-value pairs (each as 2-element lists)
test('headers.values retrieves all custom headers', () => {
  headers.add('Content-Type', 'application/json');
  headers.add('Content-Encoding', 'gzip');
  headers.add('Keep-Alive', 'timeout=5, max=1000');

  const pairs = headers.values();
  expect(pairs.length).toBe(3);
  expect(pairs[0]).toStrictEqual(['Content-Type', 'application/json']);
  expect(pairs[1]).toStrictEqual(['Content-Encoding', 'gzip']);
  expect(pairs[2]).toStrictEqual(['Keep-Alive', 'timeout=5, max=1000']);
});

// An empty list should be returned when no custom headers are stored.
test('headers.values returns empty list when no custom headers stored', () => {
  expect(headers.values().length).toBe(0);
});
