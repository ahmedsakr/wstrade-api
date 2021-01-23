import Ticker from '../ticker';

// Empty strings are not allowed because we need the symbol at least
// to make any use out of it
test('Ticker empty string', () => {
  expect(() => new Ticker('')).toThrow('Empty ticker');
});

// Symbol only is a common way to pass around tickers. The symbol
// is usually sufficient to uniquely identify a security.
test('Ticker as symbol only', () => {
  const ticker = new Ticker('AAPL');
  expect(ticker.symbol).toBe('AAPL');
  expect(ticker.exchange).toBe(undefined);
  expect(ticker.id).toBe(null);
  expect(ticker.format()).toBe('AAPL');
});

// Attempting to pass an invalid exchange in a composite format.
test('Ticker as symbol and (invalid) exchange composite', () => {
  expect(() => new Ticker('AAPL:ME')).toThrow('Invalid exchange \'ME\'!');
});

// Valid symbol and exchange format. Symbol and exchange are expected
// to be successfully extracted
test('Ticker as symbol and (valid) exchange composite', () => {
  const ticker = new Ticker('AAPL:NASDAQ');
  expect(ticker.symbol).toBe('AAPL');
  expect(ticker.exchange).toBe('NASDAQ');
  expect(ticker.id).toBe(null);
  expect(ticker.format()).toBe('AAPL:NASDAQ');
});

// Empty ticker objects are also rejected by the constructor.
test('Ticker as empty object', () => {
  expect(() => new Ticker({})).toThrow();
});

// Symbol is sufficient information for a ticker
test('Ticker as object with symbol only', () => {
  const ticker = new Ticker({ symbol: 'AAPL' });
  expect(ticker.symbol).toBe('AAPL');
  expect(ticker.exchange).toBe(undefined);
  expect(ticker.id).toBe(undefined);
  expect(ticker.format()).toBe('AAPL');
});

// Symbol and exchange will be stored in the ticker object.
test('Ticker as object with symbol and exchange', () => {
  const ticker = new Ticker({ symbol: 'AAPL', exchange: 'NASDAQ' });
  expect(ticker.symbol).toBe('AAPL');
  expect(ticker.exchange).toBe('NASDAQ');
  expect(ticker.id).toBe(undefined);
  expect(ticker.format()).toBe('AAPL:NASDAQ');
});

// Securities under NEO are identified by WS trade under the full name
// of the exchange rather than the acronym, unlike all other exchanges.
// The Ticker constructor does the necessary translation.
test('Ticker with NEO exchange is internally mapped to full name', () => {
  const ticker = new Ticker('CYBN:NEO');
  expect(ticker.symbol).toBe('CYBN');
  expect(ticker.exchange).toBe('AEQUITAS NEO EXCHANGE');
  expect(ticker.id).toBe(null);
  expect(ticker.format()).toBe('CYBN:NEO');
});

test('Ticker with CC exchange is treated as cryptocurrency', () => {
  const ticker = new Ticker('BTC:CC');
  expect(ticker.symbol).toBe('BTC');
  expect(ticker.exchange).toBe(null);
  expect(ticker.id).toBe(null);
  expect(ticker.crypto).toBe(true);
  expect(ticker.format()).toBe('BTC:CC');
})

// The user can specify the internal id of the security instead of
// a symbol.
test('Ticker as internal id', () => {
  const ticker = new Ticker({ id: 'sec-s-76a7155242e8477880cbb43269235cb6' });
  expect(ticker.symbol).toBe(undefined);
  expect(ticker.exchange).toBe(undefined);
  expect(ticker.id).toBe('sec-s-76a7155242e8477880cbb43269235cb6');
  expect(ticker.format()).toBe('sec-s-76a7155242e8477880cbb43269235cb6');
});

// A weak comparison does not consider exchanges with evaluating if tickers
// are equal. This is used to to filter orders by tickers in the orders module,
// but the order data returned by WS trade does not contain exchange.
test('Weak comparison between two tickers with same symbol but different exchanges', () => {
  const ticker1 = new Ticker('AAPL:NASDAQ');
  const ticker2 = new Ticker('AAPL');
  expect(ticker1.weakEquals(ticker2)).toBe(true);
});

// Varying symbols will return a false comparison
test('Weak comparison between two tickers with different symbols', () => {
  const ticker1 = new Ticker('AAPL');
  const ticker2 = new Ticker('SU');
  expect(ticker1.weakEquals(ticker2)).toBe(false);
});

// Varying ids will return a false comparison
test('Weak comparison between two tickers with different ids', () => {
  const ticker1 = new Ticker({ id: 'sec-s-76a7155242e8477880cbb43269235cb6' });
  const ticker2 = new Ticker({ id: 'sec-s-72a7155241e8479880cbb43269235cb6' });
  expect(ticker1.weakEquals(ticker2)).toBe(false);
});

// Even though weakEquals does not consider exchange, it does differentiate
// between cryptocurrencies and conventional securities.
test('Weak comparison between conventional security and cryptocurrency', () => {
  const ticker1 = new Ticker('ETH:CC');
  const ticker2 = new Ticker('ETH');
  expect(ticker1.weakEquals(ticker2)).toBe(false);
})