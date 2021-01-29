[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/auth/examples.js)

Authentication
===

Most `wstrade-api` API calls are privileged communication with Wealthsimple Trade servers. You must have authenticated against a valid account before you can unlock all API calls.

**Do you store my email and password?**

No. Not at all. Wealthsimple Trade operates on an OAuth2.0 framework. Once you invoke the login API with your email and password combination, `access`/`refresh` tokens are returned and stored in `auth.tokens`. These tokens are then subsequently used to identify you and invoke all APIs.

One-Time Password (OTP)
---
OTPs are required for logging into Wealthsimple Trade for a while now. Naturally, `wstrade-api` has added support for providing the OTP as part of the login process. The support is exposed in terms of an **authentication event** that can be configured with the auth.`on` API.

See the API reference for [auth.`on`](#auth-on) below and check examples in this folder for practical guidance.

<a id="authentication-tokens"></a>
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

* The `access` token is used in authenticating and granting you access to Wealthsimple Trade endpoints. 
* The `refresh` token can be used to request a new `access` token. This is useful when the access token has expired.
* The `expires` property is the time (in epoch seconds) when the `access` token is no longer valid.

<a id="auth-implicit-refresh"></a>
**Implicit refresh of access token**

`wstrade-api` will attempt to refresh the `access` token automatically if `expires` indicates that it has expired. The `refresh` token must be available for this to happen. You may disable this automatic refreshing with the [config](/docs/config) module.

<a id="#api-reference"></a>

API Reference
---
* ### [auth.`on`](#auth-on)
* ### [auth.`login`](#auth-login)
* ### [auth.`refresh`](#auth-refresh)

---

<a id="auth-on"></a>
### auth.`on`

```javascript
auth.on(event, thunk) -> void
```
Registers a string literal or handler (dubbed here "thunk") for an event. The handler could be async.

Supported events

|Events| Description |
|--|--|
| `'otp'` | Event for handling one-time passwords. Invoked by `auth` during a login attempt.|

See also: [auth.`login`](#auth-login)

---

<a id="auth-login"></a>
### auth.`login`

```javascript
auth.login(email, password) -> Promise<void>
```

Attempts to login to the Wealthsimple Trade platform using the email and password combination. 
If the login was successful, `auth.tokens` will be populated with the retrieved OAuth2.0 tokens and access token expiry time. Otherwise, the return promise is rejected with the appropriate error.

An OTP provider must be configured beforehand with the auth.`on` API for the `otp` event. If the `otp` event was registered with a string literal, it is assumed that you have already obtained the OTP somehow and it will be passed along as-is. Otherwise, if you specified a function handler, it is assumed that your handler will automatically retrieve the OTP after we attempt a login without an OTP. Your OTP function should return the OTP code as a string literal. See examples for practical explanation.

**Failure reasons**
* Incorrect email/password combination
* OTP is not configured properly

See also: [Authentication Tokens](#authentication-tokens), [auth.`on`](#auth-on)

---

<a id="auth-refresh"></a>
### auth.`refresh`

```javascript
auth.refresh() -> Promise<void>
```

Attempts to refresh the access token. The new access token will automatically be saved back to `auth.tokens`. Please note that this operation requires `auth.tokens.refresh` to be available.

See also: [Implicit refresh of access token](#auth-implicit-refresh)
