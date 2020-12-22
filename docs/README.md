
Getting started with `wstrade-api`
===

`wstrade-api` is capable of performing all operations that you can manually do through the UI, including:

* Retrieving current positions in your TFSA
* Retrieving filled orders in your personal account
* Placing a limit buy order for 10 shares of AAPL in your TFSA
* Placing a stop limit sell order for 25 shares of UBER in your personal account

and a lot more usecases. `wstrade-api` is developed to provide you with the progamming autonomy to control your WealthSimple Trade account.

**Architecture overview**

`wstrade-api` is broken down into 7 modules, with each module addressing a domain of operation.

## API References and Examples

| module | Description |
|--|--|
| [`auth`](/docs/auth) |  Logging in, One-Time Passwords, managing 0Auth2.0 tokens |
| [`headers`](/docs/headers) |  Custom headers for rogue usecases |
| [`accounts`](/docs/accounts) | Open accounts, positions, meta data, bank accounts, and so on |
| [`quotes`](/docs/quotes) | Quotes for securities, ability to customize quote source |
| [`orders`](/docs/orders) | Pending/Filled/Cancelled orders, buying/selling securities |
| [`data`](/docs/data) | Securities information, exchange rates |
| [`config`](/docs/config) | Manage optional features of `wstrade-api` |

It is recommended to go through the table of modules in order if you are new to `wstrade-api`.

Importing `wstrade-api` with CommonJS, ES6
===
There is no default export in `wstrade-api`. Instead, the `wstrade-api` exports the modules independently. Below are examples of importing `wstrade-api` with CommonJS or ES6 notations.

**CommonJS**
```javascript

/**
 ** Pattern 1 **
 **/

const trade = require('wstrade-api');

// All modules are in the trade object.
console.log(trade);
//  {
//    auth:     { .. },
//    headers:  { .. },
//    accounts: { .. },
//    orders:   { .. },
//    quotes:   { .. },
//    data:     { .. },
//    config:   { .. },
//  }

// You can start accessing modules directly like this.
trade.auth.<..>;
trade.orders.<...>;


/**
 ** Pattern 2 **
 **/

// You can selectively choose what modules to bring in to your
// file.
const { auth, orders } = require('wstrade-api');

// and then use them independently!
auth.<..>;
orders.<..>;
```

**ES6/TypeScript**
```javascript

/**
 ** Pattern 1 **
 **/

// Since there is no default export, we will have to import
// all and give it a name.
import * as trade from 'wstrade-api';

// and then you can start accessing the modules in this namespaced fashion.
trade.auth.<..>;
trade.orders.<..>;


/**
 ** Pattern 2 **
 **/

// Bring in the required modules in this compact destructured notation.
import { auth, orders } from 'wstrade-api';

// and then use them independently!
auth.<..>;
orders.<..>;
```
