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
* [trade.getBankAccounts()](#getBankAccounts)
* [trade.getDeposits()](#getDeposits)
* [trade.getExchangeRates()](#getExchangeRates)
* [trade.getOrdersByPage()](#getOrdersByPage)
* [trade.getOrders()](#getOrders)
* [trade.getPendingOrders()](#getPendingOrders)
* [trade.getFilledOrders()](#getFilledOrders)
* [trade.getCancelledOrders()](#getCancelledOrders)
* [trade.cancelOrder()](#cancelOrder)
* [trade.cancelPendingOrders()](#cancelPendingOrders)
* [trade.getSecurity()](#getSecurity)
* [trade.placeLimitBuy()](#placeLimitBuy)
* [trade.placeLimitSell()](#placeLimitSell)


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


| Parameters|Required|    
|----------|---------------------|
| username |Yes|
| password |Yes|

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


<a id="getOrdersByPage"></a>

## **trade**.getOrdersByPage(*tokens*, *accountId*, *page*) -> **Promise\<result\>**


Grabs a page (20) of orders (filled, pending, and cancelled) from a specific account under the WealthSimple Trade account.

**Note**: The pages of orders are sorted by most recent. If
you specify a page that exceeds the number of pages, the results list will be empty.


| Parameters|Required|Acceptable Values|
|----------|---------------------|----------|
| tokens |Yes||
| accountID|Yes||
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
| accountID|Yes|

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
| accountID|Yes|
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
| accountID|Yes|
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
| accountID|Yes|
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

## **trade**.getSecurity(*tokens*, *ticker*) -> **Promise\<result\>**

Information about a security on the WealthSimple Trade Platform.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| ticker |Yes|

### Return on Success

```javascript
{
    // A lot of information about the security
    ...
}
```

[Back to top—>](#index)


<a id="placeLimitBuy"></a>

## **trade**.placeLimitBuy(*tokens*,*accountId*, *ticker*, *limit*, *quantity*) -> **Promise\<result\>** ##

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


## Contributing

Feel free to fork the GitHub repository, make any changes, and contribute by setting up a pull request. This project is new and help is greatly appreciated.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Ahmed Sakr** - *Owner* - [@ahmedsakr](https://github.com/ahmedsakr)

## License

This project is licensed under the MIT License.

## Acknowledgments

A huge thanks to the contributors of [this](https://github.com/MarkGalloway/wealthsimple-trade/) repository for providing an elegant API documentation.
