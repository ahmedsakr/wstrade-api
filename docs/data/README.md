
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/data/examples.js)

Data
===
`data` module allows you to draw datasets from WealthSimple Trade endpoints that may be useful for your business logic, including:
* Exchange rates for USD/CAD
* Extensive information about securities offered on the platform

This module is currently limited, but has lots of room for growth in later versions.

<a id="#api-reference"></a>

API Reference
---
* ### [data.`exchangeRates`](#data-exchangeRates)
* ### [data.`getSecurity`](#data-getSecurity)
---

<a id="data-exchangeRates"></a>
### data.`exchangeRates`

A snapshot of the current USD/CAD exchange rates on the WealthSimple Trade
platform.

[View examples](/docs/data/examples.js)

```javascript
data.exchangeRates() -> Promise<any>
```
```javascript
{
  USD: {
    buy_rate: 1.3009,
    sell_rate: 1.2621,
    spread: 0.015,
    fx_rate: 1.2814
  }
}
```

---

<a id="data-getSecurity"></a>
### data.`getSecurity`

Information about a security on the WealthSimple Trade Platform.
* `ticker` is an identifier for a security. Read [this document](/docs/ticker.md) to understand how you can specify the ticker.
* `extensive` is a boolean that triggers a more detailed information draw, including the quote of the security.
```javascript
data.getSecurity(ticker, [extensive]) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  currency: 'USD',
  security_type: 'equity',
  ws_trade_eligible: true,
  cds_eligible: true,
  active_date: '1980-12-12',
  inactive_date: null,
  active: true,
  buyable: true,
  sellable: true,
  groups: [],
  status: 'trading',
  stock: {
    allowed_account_types: [ ... ],
    ...
  },
  allowed_order_subtypes: [ 'market', 'limit', 'stop_limit' ],
  ...
}
```

