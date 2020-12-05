[Skip to API reference -->](#api-reference)

Authentication
===

Most `wstrade-api` API calls are privileged communication with WealthSimple Trade servers. You must have authenticated against a valid account before you can unlock all API calls.

**Do you store my email and password?**

No. Not at all. WealthSimple Trade operates on an OAuth2.0 framework. Once you invoke the login API with your email and password combination, `access`/`refresh` tokens are returned and stored in `wstrade-api`, specifcally in `auth.tokens`. These tokens are then subsequently used to identify you and invoke all APIs.

Authentication Tokens
---

Once you have successfully logged in, the 0Auth2.0 tokens are stored in the `auth.tokens` object:

```javascript
auth.tokens = {
  access: 'm8GKZp_wdnnae4JnqUmpNInZli-IkP9escCGcvwEsTQ',
  refresh: 'O3xScrMpYlPxdaDu2QM-yS-YlJS8s4jwZYZlHbt5RC0',
  expires: 1607137004
};
```

* The `access` token is used in authenticating and granting you access to WealthSimple Trade endpoints. 
* The `refresh` token can be used to request a new `access` token. This is useful when the access token has expired.
* The `expires` property is the time (in epoch seconds) when the `access` token is no longer valid.

**Implicit refresh of access token**

`wstrade-api` will attempt to refresh the `access` token automatically if `expires` indicates that it has expired. The `refresh` token must be available for this to happen. You may disable this automatic refreshing with the [config](/examples/config) module.

<a id="#api-reference"></a>

API Reference
---

