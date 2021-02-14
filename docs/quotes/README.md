
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/quotes/examples.js)

Quotes
===
The `quotes` module exposes the domain of quote retrieval for securities listed on Wealthsimple Trade. Moreover, the module provides you with the ability to provide a custom quote provider for certain stock exchanges. This is beneficial for you if you have an external real-time quote provider that you would like to integrate and use for buying/selling stock with `wstrade-api`. 

**Default Quote Provider**
The default quote providier is Wealthsimple Trade itself, despite the quotes being delayed by 15 minutes. If you wish to use a different source, you can do so with the quotes.`use` API.

<a id="#api-reference"></a>

API Reference
---
* ### [quotes.`use`](#quotes-use)
* ### [quotes.`get`](#quotes-get)
* ### [quotes.`history`](#quotes-history)
---

<a id="quotes-use"></a>
### quotes.`use`

```javascript
quotes.use(exchange, provider) -> void
```
Attach a custom quote provider for the specified exchange.
* `provider` must be an object that has a `get` function that takes one parameter (`ticker`) and returns the quote as a number.

**Note**: the `orders` module makes use of the `quotes` module for its orders.`marketBuy` and orders.`marketSell` APIs. A custom quote provider will be utilized in a market buy or sell if the security trades on the specified exchange.

**Caution**: You CANNOT configure a custom provider for cryptocurrencies at this moment. Wealthsimple Trade servers seem to not honour the limit price provided for cryptocurrencies and execute them at their best price.

[View examples](/docs/quotes/examples.js)

See also: [orders.`marketBuy`](/docs/orders/README.md#orders-marketBuy), [orders.`marketSell`](/docs/orders/README.md#orders-marketSell)

---

<a id="quotes-get"></a>
### quotes.`get`

```javascript
quotes.get(ticker) -> Promise<number>
```
Obtains a quote for the ticker. The source of the quote is by default from Wealthsimple trade, but it could be a custom provider if a valid provider is registered for the exchange that the ticker trades on.
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to learn how to construct a valid ticker.

[View examples](/docs/quotes/examples.js)

See also: [quotes.`use`](#quotes-use)


---

<a id="quotes-history"></a>
### quotes.`history`

Retrieves the historical quotes within a specified interval for the ticker. The source of the historical data is not customizable at this time because there is no need for it to be so.
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to learn how to construct a valid ticker.
* `interval` must be either `1d`, `1w`, `1m`, `3m`, `1y`, or `5y`

[View examples](/docs/quotes/examples.js)

```javascript
quotes.history(ticker, interval) -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
    {
      adjusted_price: 13660.17,
      date: '2020-05-16',
      time: '20:00:00',
      currency: 'CAD',
      security_id: 'sec-z-btc-4ca670cac10139ce8678b84836231606',
      data_source: 'crypto-service',
      close: 13660.17
    },
    {
      adjusted_price: 13595.57,
      date: '2020-05-17',
      time: '20:00:00',
      currency: 'CAD',
      security_id: 'sec-z-btc-4ca670cac10139ce8678b84836231606',
      data_source: 'crypto-service',
      close: 13595.57
    },
    ...
]
```
