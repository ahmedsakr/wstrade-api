
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/orders/examples.js)

Orders
===
The `orders` module can be described as the most exciting module in `wstrade-api`as you have the ability to:
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

```javascript
orders.page(accountId, page) -> void
```
