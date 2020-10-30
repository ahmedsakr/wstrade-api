<div style="max-height: 50px; max-width: 150px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/900px-JavaScript-logo.png" width="50px" height="50px">

<img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" width="50px" height="50px">
</div>

# wstrade-api

A tiny Unofficial WealthSimple Trade API Wrapper for JavaScript, supporting the core abilities of the WealthSimple Trade application including placing orders, viewing and cancelling orders, and more.

## Disclaimer

**USE AT YOUR OWN RISK**. This is an unofficial WealthSimple Trade API Wrapper, and it is new. While i did (to my best ability) test the functions, there is absolutely no guarantee that there are no bugs in the code. The API Wrapper will be improved over time.

**DO NOT LEVERAGE THIS IN ATTEMPT TO DISRUPT ORDERLY MARKET FUNCTIONS**. This package is provided to you so you can
build cool shit with it, but you should understand that you have a responsibility to not engage in illegal
trading behaviours that can disrupt orderly market functions. This means that you should not flood the API with orders
in a fast manner. You might even get banned or locked out by WealthSimple Trade if you abuse their endpoints.

You would be abusing this tool if you are leveraging it to carry out tactics that would provide you
illegitimate personal gains. For example, [Spoofing](https://en.wikipedia.org/wiki/Spoofing_(finance)) is a forbidden tactic that has demonstrable negative effects on the operation of the markets.

My recommendation is to be very conservative on how many orders you place within a small timeframe. I have no idea what
the maximum amount of orders is by any timeframe, but if you have a gut feeling that it is too much, then it is too much.

A user of wstrade-api has observed that trades in excess of 7 per hour are rejected by the WealthSimple Trade servers. You
can use this observation as a baseline of how many trades you can perform on an hourly basis.

## Deprecated Versions

* Versions `<= v0.9.0` are deprecated due to a WS Trade architecture change in handling buy and sell APIs. These old versions
will work for everything except buying and selling. Upgrade to a later version if you wish to use the buying and selling
APIs.

## Getting Started

Before playing with **wstrade-api**, you must have a valid
WealthSimple Trade account to authenticate against. If you have not signed up for WealthSimple Trade, you may download the iOS application [here](https://apps.apple.com/ca/app/wealthsimple-trade/id1403491709) or the android application [here](https://play.google.com/store/apps/details?id=com.wealthsimple.trade&hl=en_CA).

### Prerequisites

You just need node.js — and npm, obviously.


### Installing

Install **wstrade-api** from the npm registry

```
npm i wstrade-api
```

You could also clone the GitHub repository

```
git clone git@github.com:ahmedsakr/wstrade-api.git
```

## Dependencies

The dependency list is tiny — **node-fetch** and **http-status**. That's it.
* [node-fetch](https://www.npmjs.com/package/node-fetch) - Used for interacting with the WealthSimple Trade API
* [http-status](https://www.npmjs.com/package/http-status) - Used for well-known HTTP status codes.

## Documentation

After installing **wstrade-api** from the npm registry, import it into your JavaScript file.

```javascript
import trade from 'wstrade-api';
```

## Server-Side Limitation

This wrapper will not work when executed on the client-side due to the underlying CORS security limitation imposed by the WealthSimple Trade endpoints.
If you wish to build a front-end application, you will have to design an architecture where the server
does all of the API calls.

<a id="index"></a>

## Jump to

* [trade.login()](#login)
* [trade.refresh()](#refresh)
* [trade.addHeader()](#addHeader)
* [trade.removeHeader()](#removeHeader)
* [trade.clearHeaders()](#clearHeaders)
* [trade.getAccounts()](#getAccounts)
* [trade.getAccountData()](#getAccountData)
* [trade.getHistory()](#getHistory)
* [trade.getActivities()](#getActivities)
* [trade.getBankAccounts()](#getBankAccounts)
* [trade.getDeposits()](#getDeposits)
* [trade.getExchangeRates()](#getExchangeRates)
* [trade.getPositions()](#getPositions)
* [trade.getOrdersByPage()](#getOrdersByPage)
* [trade.getOrders()](#getOrders)
* [trade.getPendingOrders()](#getPendingOrders)
* [trade.getFilledOrders()](#getFilledOrders)
* [trade.getCancelledOrders()](#getCancelledOrders)
* [trade.cancelOrder()](#cancelOrder)
* [trade.cancelPendingOrders()](#cancelPendingOrders)
* [trade.getSecurity()](#getSecurity)
* [trade.placeMarketBuy()](#placeMarketBuy)
* [trade.placeLimitBuy()](#placeLimitBuy)
* [trade.placeStopLimitBuy()](#placeStopLimitBuy)
* [trade.placeMarketSell()](#placeMarketSell)
* [trade.placeLimitSell()](#placeLimitSell)
* [trade.placeStopLimitSell()](#placeStopLimitSell)


## Failure return

For all API Calls, the failure return is standardized to the following:

```javascript
{
    status, // HTTP status
    reason, // Failure reason,

    // The body of the response
    body: {
        ...
    } 
}
```

[Back to top—>](#index)


<a id="login"></a>

## **trade**.login(*email*, *password*) -> **Promise\<result\>**


Attempts to login to the WealthSimple Trade platform using the email and password combination.

**One-Time Password**


WealthSimple Trade has required mandatory OTP authentication for their login API. To get the
OTP code sent to you, you need to first attempt to login without an OTP code. Afterwards, You may provide
the OTP code as a third argument for the `login` API, `otp_func`; `otp_func` is a parameterless
function that is expected to return the OTP code as a string.

Here is an automated example:

```
// No OTP argument so WealthSimple Trade will dispatch OTP. This promise will fail.
trade.login('test@example.ca', 'password')

// Now that we have the OTP code, let's try to plug it into the login...
.catch(trade.login('test@example.ca', 'password', async () => {
    
    ...
    // somehow get the OTP code automatically..
    ...

    return '172823';
})); 
```

Or if you prefer to manually input the OTP code, you can just run your program twice: First time
without the `otp_func` parameter, and the second time with the `otp_func` parameter immediately
returning the OTP code.

```

// ~~~ First program run ~~~
// No OTP argument so WealthSimple Trade will dispatch OTP. This promise will fail.
trade.login('test@example.ca', 'password');

// ~~~ Second program run ~~~
trade.login('test@example.ca', 'password', () => '162782'); // We should be authenticated now!
```

| Parameters|Required|    
|----------|---------------------|
| username |Yes|
| password |Yes|
| otp_func |No|

### Return on Success

```javascript
{
    tokens: {
        access, // Authentication token
        refresh // Token to refresh authentication
    },

    // General information of the account
    accountInfo: {
        ...
    }
}
```

[Back to top—>](#index)


<a id="refresh"></a>

## **trade**.refresh(*tokens*) -> **Promise\<result\>**


Generates a new set of access and refresh tokens.


| Parameters|Required|    
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
{
    // A new generated set of access and refresh tokens
    access: 'XXXXX',
    refresh: 'YYYY'
}
```

[Back to top—>](#index)

<a id="addHeader"></a>

## **trade**.addHeader(*name*, *value*) -> **void**


Appends a custom header to all requests made with this wrapper.


| Parameters|Required|    
|----------|---------------------|
| name |Yes|
| value |Yes|

[Back to top—>](#index)


<a id="removeHeader"></a>

## **trade**.removeHeader(*name*) -> **void**


Removes a custom header.


| Parameters|Required|    
|----------|---------------------|
| name |Yes|

[Back to top—>](#index)


<a id="clearHeaders"></a>

## **trade**.clearHeaders() -> **void**


Deletes all custom headers.

[Back to top—>](#index)


<a id="getAccounts"></a>

## **trade**.getAccounts(*tokens*) -> **Promise\<result\>**


Grabs all account ids under this WealthSimple Trade account (i.e., all personal, TFSA, and RRSP account ids).


| Parameters|Required|    
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
// A list of account ids
['non-registered-XXXXX', 'tfsa-XXXXX', ...]
```

[Back to top—>](#index)


<a id="getAccountData"></a>

## **trade**.getAccountData(*tokens*) -> **Promise\<result\>**


Provides the general state information of the overall WealthSimple Trade account, including current balance, net deposits, available to withdraw, creation date, and more.


| Parameters|Required|    
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
{
    // General information of the overall WealthSimple Trade account
    ...
}
```

[Back to top—>](#index)


<a id="getHistory"></a>

## **trade**.getHistory(*tokens*, *interval*, *accountId*) -> **Promise\<result\>**


Captures a snapshot of the performance for a specific account
in the provided time interval.


| Parameters|Required|Acceptable values    
|----------|---------------------|-----------|
| tokens |Yes||
| interval |Yes|1d, 1w, 1m, 3m, 1y|
| accountId |Yes||

### Return on Success

```javascript
{

    // Day basis performance of the account
    results: [

        // Day 1...
        {
            ...
        },

        // Day 2...
        {
            ...
        },
        
        ...
    ]

    // Current performance 
    ...
}
```


[Back to top—>](#index)


<a id="getActivities"></a>

## **trade**.getActivities(*tokens*) -> **Promise\<result\>**


Provides the most recent 20 activities (deposits, dividends, orders, etc) on the WealthSimple
Trade account.


| Parameters|Required|   
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
[

    // Activity 1 details
    {
        ...
    },

    // Activity 2 details
    {
        ...
    },
    
    ...
]
```


[Back to top—>](#index)



<a id="getBankAccounts"></a>


## **trade**.getBankAccounts(*tokens*) -> **Promise\<result\>**


Provides a list of the bank accounts that have been linked to the WealthSimple Trade account.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
[
    // Bank account 1
    {
        ...
    },

    // Bank account 2
    {
        ...
    },

    ...
]
```

[Back to top—>](#index)


<a id="getDeposits"></a>

## **trade**.getDeposits(*tokens*) -> **Promise\<result\>**


All deposits (in progress, completed, and cancelled) made to the WealthSimple Trade account.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
[
    // Deposit 1
    {
        ...
    },

    // Deposit 2
    {
        ...
    },

    ...
]
```

[Back to top—>](#index)


<a id="getExchangeRates"></a>


## **trade**.getExchangeRates(*tokens*) -> **Promise\<result\>**

Provides the current USD/CAD conversion rates for the WealthSimple Trade platform.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success

```javascript
{
    "USD": {
        "buy_rate": 1.xxx,
        "sell_rate": 1.xxx,
        "spread": 0.xxx,
        "fx_rate": 1.xxx
    }
}
```

[Back to top—>](#index)



<a id="getPositions"></a>

## **trade**.getPositions(*tokens*, *accountId*) -> **Promise\<result\>**


Lists all active positions under the trading account associated with the account id.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|

### Return on Success

```javascript
[
    // Position 1 details
    {
        ...
    },

    // Position 2 details
    {
        ...
    },
    
    ...
]
```

[Back to top—>](#index)


<a id="getOrdersByPage"></a>

## **trade**.getOrdersByPage(*tokens*, *accountId*, *page*) -> **Promise\<result\>**


Grabs a page (20) of orders (filled, pending, and cancelled) from a specific account under the WealthSimple Trade account.

**Note**: The pages of orders are sorted by most recent. If
you specify a page that exceeds the number of pages, the results list will be empty.


| Parameters|Required|Acceptable Values|
|----------|---------------------|----------|
| tokens |Yes||
| accountId|Yes||
| page|Yes|```>=1```

### Return on Success

```javascript
{
    orders: [

        // Order 1
        {
            ...
        },

        // Order 2
        {
            ...
        },
        
        ...
    ],

    // Total number of orders
    total: XXX
}
```

[Back to top—>](#index)


<a id="getOrders"></a>

## **trade**.getOrders(*tokens*, *accountId*) -> **Promise\<result\>**

Grabs all orders (filled, pending, and cancelled) from a specific account under the WealthSimple Trade account.



| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|

### Return on Success

```javascript
{
    orders: [

        // Order 1
        {
            ...
        },

        // Order 2
        {
            ...
        },
        
        ...
    ],

    // Total number of orders
    total: XXX
}
```

[Back to top—>](#index)


<a id="getPendingOrders"></a>

## **trade**.getPendingOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all pending orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the pending orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|
| ticker   |No

### Return on Success

```javascript
{
    orders: [

        // Pending Order 1
        {
            ...
        },

        // Pending Order 2
        {
            ...
        },
        
        ...
    ],

    // Total number of pending orders
    total: XXX
}
```

[Back to top—>](#index)


<a id="getFilledOrders"></a>

## **trade**.getFilledOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all filled orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the filled orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|
| ticker   |No

### Return on Success

```javascript
{
    orders: [

        // Filled Order 1
        {
            ...
        },

        // Filled Order 2
        {
            ...
        },
        
        ...
    ],

    // Total number of filled orders
    total: XXX
}
```

[Back to top—>](#index)


<a id="getCancelledOrders"></a>

## **trade**.getCancelledOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all cancelled orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the cancelled orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|
| ticker   |No

### Return on Success

```javascript
{
    orders: [

        // Cancelled Order 1
        {
            ...
        },

        // Cancelled Order 2
        {
            ...
        },
        
        ...
    ],

    // Total number of cancelled orders
    total: XXX
}
```

[Back to top—>](#index)


<a id="cancelOrder"></a>

## **trade**.cancelOrder(*tokens*, *orderId*) -> **Promise\<result\>**

Attempts to cancel the order associated with the provided orderId.

**Note**: The order might NOT be cancelled if it was filled by WealthSimple Trade. This has nothing to do with this wrapper; be cautious!


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| orderId|Yes|

### Return on Success

```javascript
{
    order: 'order-XXXX',
    response: {} // The API returns nothing.
}
```

[Back to top—>](#index)


<a id="cancelPendingOrders"></a>

## **trade**.cancelPendingOrders(*tokens*, *accountId*) -> **Promise\<result\>**

Place a cancellation order for all pending orders in the provided account.

**Note**: The orders might NOT be cancelled if it was filled by WealthSimple Trade. This has nothing to do with this wrapper; be cautious!


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|

### Return on Success

```javascript
[
    // Cancelled Order 1
    {
        order: 'order-XXXXXXXX',
        response: {} // The API returns nothing.
    },

    // Cancelled Order 2
    {
        order: 'order-XXXXXXXX',
        response: {} // The API returns nothing.
    },

    ...
]
```

[Back to top—>](#index)


<a id="getSecurity"></a>

## **trade**.getSecurity(*tokens*, *ticker*, *extensive*) -> **Promise\<result\>**

Information about a security on the WealthSimple Trade Platform.

##### Specifying an exchange
You are allowed to specify the exchange for securities as part of the `ticker` parameter through a `<symbol>:<exchange>` postfixing format. The supported exchanges id are:
* **NASDAQ** (NASDAQ exchange)
* **TSX** (Toronto Stock exchange)
* **TSX-V** (Toronto Stock exchange (Venture))
* **NYSE** (New York Stock exchange)

For example, `PSI` trades on the NYSE and TSX stock exchanges. If you wish to retrieve the TSX stock, specify the ticker as `PSI:TSX`. Otherwise, specify the ticker as `PSI:NYSE`.

You could also specify the `ticker` parameter as an object if you prefer not to deal with the string postfixing technique. Back to the previous example for the TSX version of `PSI`, you can specify the ticker parameter as `{symbol: "PSI", exchange: "TSX"}`.

### Extensive details
If you specify the `extensive` parameter as true (or provide the security id), `getSecurity()` will return detailed information about the security, including the market quote.


| Parameters|Required|Notes|
|----------|---------------------|-|
| tokens |Yes| |
| ticker |Yes| The exchange the security trades on may be included after a colon. For example, `RMD:NYSE`|
| extensive |No| Detailed information about the security including quote

The `ticker` parameter may also be an object with the following keys:
| Key | Required | Notes |
| --- | -------- | ----- |
| symbol | Yes | See the `ticker` parameter above. |
| exchange | No | The exchange the security trades on. |
| id | No | The internal WealthSimple ID of the security. |

### Return on Success

```javascript
{
    // A lot of information about the security
    ...
}
```


[Back to top—>](#index)


<a id="placeMarketBuy"></a>

## **trade**.placeMarketBuy(*tokens*, *accountId*, *ticker*, *quantity*) -> **Promise\<result\>** ##

Attempts to market buy a given quantity of a security.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| quantity |Yes|




### Return on Success

```javascript
{
    // Confirmation and details of the market buy
    ...
}
```


[Back to top—>](#index)


<a id="placeLimitBuy"></a>

## **trade**.placeLimitBuy(*tokens*, *accountId*, *ticker*, *limit*, *quantity*) -> **Promise\<result\>** ##

Attempts to purchase a given quantity of a security at a maximum price.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| limit |Yes|
| quantity |Yes|




### Return on Success

```javascript
{
    // Confirmation and details of the limit buy
    ...
}
```

[Back to top—>](#index)


<a id="placeStopLimitBuy"></a>

## **trade**.placeStopLimitBuy(*tokens*, *accountId*, *ticker*, *stop*, *limit*, *quantity*) -> **Promise\<result\>** ##

Attempts to stop limit purchase a given quantity of a security at the provided stop and limit prices.

**Note**: TSX and TSX-V securities must have an equivalent stop and limit price.

| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| stop |Yes|
| limit |Yes|
| quantity |Yes|




### Return on Success

```javascript
{
    // Confirmation and details of the stop limit buy
    ...
}
```

[Back to top—>](#index)


<a id="placeMarketSell"></a>

## **trade**.placeMarketSell(*tokens*, *accountId*, *ticker*, *quantity*) -> **Promise\<result\>** ##

Attempts to market sell a given quantity of a security.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| quantity |Yes|




### Return on Success

```javascript
{
    // Confirmation and details of the market sell
    ...
}
```



[Back to top—>](#index)


<a id="placeLimitSell"></a>

## **trade**.placeLimitSell(*tokens*, *accountId*, *ticker*, *limit*, *quantity*) -> **Promise\<result\>** ##

Attempts to sell a given quantity of a security at a minimum price.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| limit |Yes|
| quantity |Yes|


### Return on Success

```javascript
{
    // Confirmation and details of the limit sell
    ...
}
```

[Back to top—>](#index)


<a id="placeStopLimitSell"></a>

## **trade**.placeStopLimitSell(*tokens*, *accountId*, *ticker*, *limit*, *stop*, *quantity*) -> **Promise\<result\>** ##

Attempts to stop limit sell a given quantity of a security at the provided stop and limit prices.

**Note**: TSX and TSX-V securities must have an equivalent stop and limit price.

| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| stop | Yes|
| limit |Yes|
| quantity |Yes|


### Return on Success

```javascript
{
    // Confirmation and details of the stop limit sell
    ...
}
```

[Back to top—>](#index)


## Contributing

Feel free to fork the GitHub repository, make any changes, and contribute by setting up a pull request. This project is new and help is greatly appreciated.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Ahmed Sakr** - *Owner* - [@ahmedsakr](https://github.com/ahmedsakr)
* **Mitchell Sawatzky** - *Contributor* - [@bufutda](https://github.com/bufutda)

## License

This project is licensed under the MIT License.

## Acknowledgments

A huge thanks to the contributors of [this](https://github.com/MarkGalloway/wealthsimple-trade/) repository for providing an elegant API documentation.
