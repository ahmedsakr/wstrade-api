
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/headers/examples.js)

Headers
===
`wstrade-api` handles the network-level protocol for talking to WealthSimple Trade endpoints without any necessary intervention from you. However, in rogue usecases that I cannot think of, you might need to override this with custom headers. 

The `headers` module provides you with extensibility to configure custom HTTP headers on all endpoint calls to WealthSimple Trade. 99.9% of `wstrade-api` users won't be using this module at all. However, it is still useful to know about its existence.

The `headers` module could act as insurance in events where WealthSimple Trade starts to require a certain header to be present that is not available in an older version of `wstrade-api`, for example.

<a id="#api-reference"></a>

API Reference
---
* ### [headers.`add`](#headers-add)
* ### [headers.`remove`](#headers-remove)
* ### [headers.`clear`](#headers-clear)
* ### [headers.`values`](#headers-values)
---

<a id="headers-add"></a>
```javascript
headers.add(name, value) -> void
```
Appends a custom key-value header to all endpoint requests to WealthSimple Trade.

---

<a id="headers-remove"></a>
```javascript
headers.remove(name) -> void
```
Removes a custom header that was previously added with headers.`add`.

See also: [headers.`add`](#headers-add)

---

<a id="headers-clear"></a>
```javascript
headers.clear() -> void
```

Removes all custom headers.

---

<a id="headers-values"></a>
```javascript
headers.values() -> Array<String>
```

Returns a list of all custom key-value headers.
