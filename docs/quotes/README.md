
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/quotes/examples.js)

Quotes
===
The `quotes` module exposes the domain of quote retrieval for securities listed on WealthSimple Trade. Moreover, the module provides you with the ability to provide a custom quote provider for certain stock exchanges. This is beneficial for you if you have an external real-time quote provider that you would like to integrate and use for buying/selling stock with `wstrade-api`. 

**Default Quote Provider**
The default quote providier is WealthSimple Trade itself, despite the quotes being delayed by 15 minutes. If you wish to use a different source, you can do so with the quotes.`use` API.

<a id="#api-reference"></a>

API Reference
---
* ### [quotes.`use`](#quotes-use)
* ### [quotes.`get`](#quotes-get)
---

<a id="quotes-use"></a>
### quotes.`use`

```javascript
quotes.use(exchange, provider) -> void
```
Attach a custom quote provider for the specified exchange.
* `provider` must be an object that has a `get` function that takes one parameter (`ticker`) and returns the quote as a number.

**Note**: the `orders` module makes use of the `quotes` module for its orders.`marketBuy` and orders.`marketSell` APIs. A custom quote provider will be utilized in a market buy or sell if the security trades on the specified exchange.

[View examples](/docs/quotes/examples.js)

See also: [orders.`marketBuy`](/docs/orders/README.md#orders-marketBuy), [orders.`marketSell`](/docs/orders/README.md#orders-marketSell)

---

<a id="quotes-get"></a>
### quotes.`get`

```javascript
quotes.get(ticker) -> Promise<number>
```
Obtains a quote for the ticker. The source of the quote is by default from WealthSimple trade, but it could be a custom provider if a valid provider is registered for the exchange that the ticker trades on.
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.

[View examples](/docs/quotes/examples.js)

See also: [quotes.`use`](#quotes-use)
