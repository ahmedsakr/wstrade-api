[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/auth/examples.js)

Authentication
===

Most `wstrade-api` API calls are privileged communication with Wealthsimple Trade servers. You must have authenticated against a valid account before you can unlock all API calls.

**Do you store my email and password?**

No. Not at all. Wealthsimple Trade operates on an OAuth2.0 framework. Once you invoke the login API with your email and password combination, `access`/`refresh` tokens are returned and stored in `auth.tokens`. These tokens are then subsequently used to identify you and invoke all APIs.

One-Time Password (OTP)
---
OTPs are required for logging into Wealthsimple Trade. Naturally, `wstrade-api` has added support for providing the OTP as part of the login process. The support is exposed in terms of an **authentication event** that can be configured with the [auth.`on`](#auth-on) API.

See the API reference for [auth.`on`](#auth-on) below and check examples in this folder for practical guidance.

<a id="authentication-tokens"></a>
Authentication Tokens
---

Once you have successfully logged in, the authentication tokens are stored internally similarly to the following object:

```javascript
{
  access: 'm8GKZp_wdnnae4JnqUmpNInZli-IkP9escCGcvwEsTQ',
  refresh: 'O3xScrMpYlPxdaDu2QM-yS-YlJS8s4jwZYZlHbt5RC0',
  expires: 1607137004
}
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
* ### [auth.`use`](#auth-use)
* ### [auth.`tokens`](#auth-tokens)
* ### [auth.`login`](#auth-login)
* ### [auth.`refresh`](#auth-refresh)

---

<a id="auth-on"></a>
### auth.`on`

```javascript
auth.on(event, handler) -> void
```
Registers a string literal or handler for an event. The handler could be a function (sync/async) or it could be a string literal (i.e., constant literal handler).

Supported events

|Events| Description |
|--|--|
| `'otp'` | Event for handling one-time passwords. Invoked by `auth` during a login attempt.|
| `'refresh'`<span style="color:red;"><sup>new</sup></span> | Event for handling a token refresh, implicit or explicit. Invoked by `auth` after tokens are refreshed. |

See also: [auth.`login`](#auth-login)


---

<a id="auth-use"></a>
### auth.`use`

```javascript
auth.use(state) -> void
```
Initialize the auth module with an existing state of tokens. The state provided should contain `access`, `refresh`, and `expires` properties (i.e., exact object format returned by [auth.`tokens`](#auth-tokens)).

Use of this API is recommended if you have valid authentication tokens that you want to reuse. 

See also: [auth.`tokens`](#auth-tokens)


---

<a id="auth-tokens"></a>
### auth.`tokens`

```javascript
auth.tokens() -> AuthTokens
```
Snapshot object of the current authentication tokens, containing `access`, `refresh`, and `expires`. An example return object is shown below.

```javascript
{
  access: 'm8GKZp_wdnnae4JnqUmpNInZli-IkP9escCGcvwEsTQ',
  refresh: 'O3xScrMpYlPxdaDu2QM-yS-YlJS8s4jwZYZlHbt5RC0',
  expires: 1607137004
}
```

Use of this API is recommended if you have valid authentication tokens that you want to reuse so you could avoid re-logging in.

See also: [auth.`login`](#auth-login), [auth.`use`](#auth-use)

---

<a id="auth-login"></a>
### auth.`login`

```javascript
auth.login(email, password) -> Promise<void>
```

Attempts to login to the Wealthsimple Trade platform using the email and password combination. If the login was successful, the authentication tokens will be stored and used for authenticated APIs. Otherwise, the return promise is rejected with the appropriate error.

An OTP provider must be configured beforehand with the [auth.`on`](#auth-on) API for the `otp` event. If the `otp` event was registered with a string literal, it is assumed that you have already obtained the OTP somehow and it will be passed along as-is. Otherwise, if you specified a function handler, it is assumed that your handler will automatically retrieve the OTP after we attempt a login without an OTP. Your OTP function should return the OTP code as a string literal. See examples for practical explanation.

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

Attempts to refresh the access token. The new set of tokens will be stored internally for later usage.

**Note**:  refreshing requires the `refresh` token to be available internally.

See also: [Implicit refresh of access token](#auth-implicit-refresh)
