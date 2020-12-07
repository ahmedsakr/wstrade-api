
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/orders/examples.js)

Orders
===
The `orders` module can be described as the most exciting module in `wstrade-api` because you have the ability to:
* buy and sell securities (Market, Limit, and Stop limit all supported)
* cancel one or all pending orders
* View pending, cancelled, filled, or all orders

<a id="#api-reference"></a>

API Reference
---
* ### [orders.`page`](#orders-page)
* ### [orders.`all`](#orders-all)
* ### [orders.`pending`](#orders-pending)
* ### [orders.`filled`](#orders-filled)
* ### [orders.`cancelled`](#orders-cancelled)
* ### [orders.`cancel`](#orders-cancel)
* ### [orders.`cancelPending`](#orders-cancelPending)
* ### [orders.`marketBuy`](#orders-marketBuy)
* ### [orders.`limitBuy`](#orders-limitBuy)
* ### [orders.`stopLimitBuy`](#orders-stopLimitBuy)
* ### [orders.`marketSell`](#orders-marketSell)
* ### [orders.`limitSell`](#orders-limitSell)
* ### [orders.`stopLimitSell`](#orders-stopLimitSell)
---

<a id="orders-page"></a>
### orders.`page`

Collects orders (filled, pending, cancelled) for the provided page and
account id. A page is a maximum of 20 orders.
* `page` must be `>=1`. An empty list will be returned by orders.`page` if the page exceeds the total number of pages.
* `accountId` must be one returned by accounts.`all`

[View examples](/docs/orders/examples.js)

```javascript
orders.page(accountId, page) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  total: 170,
  orders: [
    {
      object: 'order',
      created_at: '1970-01-01T13:42:52.422Z',
      completed_at: null,
      user_id: 00000,
      account_id: 'tfsa-zzzzzzz',
      external_order_id: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      status: 'posted',
      quantity: 7,
      fill_quantity: 7,
      symbol: 'AAPL',
      security_name: 'Apple Inc',
      ...
    },
    19 more items...
  ]
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-all"></a>
### orders.`all`

Collects all orders (filled, pending, cancelled) for the specific open account.
* `accountId` must be one returned by accounts.`all`

[View examples](/docs/orders/examples.js)

```javascript
orders.all(accountId) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  total: 170,
  orders: [
    {
      object: 'order',
      created_at: '1970-01-01T13:42:52.422Z',
      completed_at: null,
      user_id: 00000,
      account_id: 'tfsa-zzzzzzz',
      external_order_id: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      status: 'posted',
      quantity: 7,
      fill_quantity: 7,
      symbol: 'AAPL',
      security_name: 'Apple Inc',
      ...
    },
    70 more items...
  ]
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-pending"></a>
### orders.`pending`

Retrieves pending orders for the specified security in the open account. If `ticker` is provided, only pending orders that match the security are returned.
* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.

[View examples](/docs/orders/examples.js)

```javascript
orders.pending(accountId, [ticker]) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  total: 3,
  orders: [
    {
      object: 'order',
      created_at: '1970-01-01T13:42:52.422Z',
      completed_at: null,
      user_id: 00000,
      account_id: 'tfsa-zzzzzzz',
      external_order_id: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      status: 'submitted',
      quantity: 7,
      symbol: 'AAPL',
      security_name: 'Apple Inc',
      ...
    },
    2 more items...
  ]
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-filled"></a>
### orders.`filled`

Retrieves filled orders for the specified security in the open account. If `ticker` is provided, only filled orders that match the security are returned.
* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.

[View examples](/docs/orders/examples.js)

```javascript
orders.filled(accountId, [ticker]) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  total: 9,
  orders: [
    {
      object: 'order',
      created_at: '1970-01-01T13:42:52.422Z',
      user_id: 00000,
      account_id: 'tfsa-zzzzzzz',
      external_order_id: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      status: 'posted',
      quantity: 7,
      fill_quantity: 7,
      symbol: 'AAPL',
      security_name: 'Apple Inc',
      ...
    },
    8 more items...
  ]
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-cancelled"></a>
### orders.`cancelled`

Retrieves cancelled orders for the specified security in the open account. If `ticker` is provided, only cancelled orders that match the security are returned.
* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.

[View examples](/docs/orders/examples.js)

```javascript
orders.cancelled(accountId, [ticker]) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  total: 2,
  orders: [
    {
      object: 'order',
      created_at: '1970-01-01T13:42:52.422Z',
      completed_at: null,
      user_id: 00000,
      account_id: 'tfsa-zzzzzzz',
      external_order_id: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
      order_type: 'sell_quantity',
      order_sub_type: 'market',
      status: 'cancelled',
      quantity: 7,
      symbol: 'AAPL',
      security_name: 'Apple Inc',
      ...
    },
    1 more item...
  ]
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-cancel"></a>
### orders.`cancel`

Cancels the pending order specified by the order id.
* `orderId` may be retrieved from orders.`page`, orders.`all`, orders.`pending`, orders.`filled`, or orders.`cancelled`.

[View examples](/docs/orders/examples.js)

```javascript
orders.cancel(orderId) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  order: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
  response: {} // The API returns nothing.
}
```

See also: [orders.`page`](#orders-page), [orders.`all`](#orders-all), [orders.`pending`](#orders-pending), [orders.`filled`](#orders-filled), [orders.`cancelled`](#orders-cancelled)

---

<a id="orders-cancelPending"></a>
### orders.`cancelPending`

Cancels all pending orders under the open account specified by `accountId`
* `accountId` must be one returned by accounts.`all`

[View examples](/docs/orders/examples.js)

```javascript
orders.cancelPending(accountId) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
[
  // Cancelled Order 1
  {
    order: 'order-zzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzz',
    response: {} // The API returns nothing.
  },

  // Cancelled Order 2
  {
    order: 'order-yyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyy',
    response: {} // The API returns nothing.
  },
  ...
]
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-marketBuy"></a>
### orders.`marketBuy`

Purchase a security with a market order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `quantity` is the number of shares you wish to purchase

[View examples](/docs/orders/examples.js)

```javascript
orders.marketBuy(accountId, ticker, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the market buy
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-limitBuy"></a>
### orders.`limitBuy`

Purchase a security with a limit order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `limit` is the highest price you are willing to pay for the security
* `quantity` is the number of shares you wish to purchase

[View examples](/docs/orders/examples.js)

```javascript
orders.limitBuy(accountId, ticker, limit, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the limit buy
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-stopLimitBuy"></a>
### orders.`stopLimitBuy`

Purchase a security with a stop limit order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `stop` is the price of the security at which the order converts to a limit order
* `limit` is the highest price you are willing to pay for the security
* `quantity` is the number of shares you wish to purchase

[View examples](/docs/orders/examples.js)

```javascript
orders.stopLimitBuy(accountId, ticker, stop, limit, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the stop limit buy
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-marketSell"></a>
### orders.`marketSell`

Sell a security with a market order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `quantity` is the number of shares you wish to sell

[View examples](/docs/orders/examples.js)

```javascript
orders.marketSell(accountId, ticker, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the market sell
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-limitSell"></a>
### orders.`limitSell`

Sell a security with a limit order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `limit` is the lowest price you are willing to sell the security for
* `quantity` is the number of shares you wish to sell

[View examples](/docs/orders/examples.js)

```javascript
orders.limitSell(accountId, ticker, limit, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the limit sell
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)

---

<a id="orders-stopLimitSell"></a>
### orders.`stopLimitSell`

Sell a security with a stop limit order.

* `accountId` must be one returned by accounts.`all`
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `stop` is the price of the security at which the order converts to a limit order
* `limit` is the lowest price you are willing to sell the security for
* `quantity` is the number of shares you wish to sell

[View examples](/docs/orders/examples.js)

```javascript
orders.stopLimitSell(accountId, ticker, stop, limit, quantity) -> Promise<any>
```
```javascript
{
  // Confirmation and details of the stop limit sell
  object: 'order',
  created_at: '1970-01-01T13:42:52.422Z',
  completed_at: null,
  user_id: 00000,
  account_id: 'tfsa-zzzzzzz',
  ...
}
```

See also: [accounts.`all`](/docs/accounts/README.md#accounts-all)
