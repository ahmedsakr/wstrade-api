# wstrade-api

A tiny Unofficial WealthSimple Trade API Wrapper for JavaScript, supporting the core abilities of the WealthSimple Trade application including placing orders, viewing and cancelling orders, and more.

## Disclaimer

**USE AT YOUR OWN RISK**. This is an unofficial WealthSimple Trade API Wrapper, and it is new. While i did (to my best ability) test the functions, there is absolutely no guarantee that there are no bugs in the code. The API Wrapper will be improved over time.

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

## Jump to

* [——> trade.login()](#login)
* [——> trade.getAccounts()](#getAccounts)
* [——> trade.getAccountData()](#getAccountData)
* [——> trade.getHistory()](#getHistory)
* [——> trade.getBankAccounts()](#getBankAccounts)
* [——> trade.getDeposits()](#getDeposits)
* [——> trade.getExchangeRates()](#getExchangeRates)
* [——> trade.getOrdersByPage()](#getOrdersByPage)
* [——> trade.getOrders()](#getOrders)
* [——> trade.getPendingOrders()](#getPendingOrders)
* [——> trade.getFilledOrders()](#getFilledOrders)
* [——> trade.getCancelledOrders()](#getCancelledOrders)
* [——> trade.cancelOrder()](#cancelOrder)
* [——> trade.cancelPendingOrders()](#cancelPendingOrders)
* [——> trade.placeLimitBuy()](#placeLimitBuy)
* [——> trade.placeLimitSell()](#placeLimitSell)


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

<a id="login"></a>

## **trade**.login(*email*, *password*) -> **Promise\<result\>**


Attempts to login to the WealthSimple Trade platform using the email and password combination.


| Parameters|Required|    
|----------|---------------------|
| username |Yes|
| password |Yes|

### Return on Success (Promise.resolve())

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

<a id="getAccounts"></a>

## **trade**.getAccounts(*tokens*) -> **Promise\<result\>**


Grabs all account ids under this WealthSimple Trade account (i.e., all personal, TFSA, and RRSP account ids).


| Parameters|Required|    
|----------|---------------------|
| tokens |Yes|

### Return on Success (Promise.resolve())

```javascript
// A list of account ids
['non-registered-XXXXX', 'tfsa-XXXXX', ...]
```

<a id="getAccountData"></a>

## **trade**.getAccountData(*tokens*) -> **Promise\<result\>**


Provides the general state information of the overall WealthSimple Trade account, including current balance, net deposits, available to withdraw, creation date, and more.


| Parameters|Required|    
|----------|---------------------|
| tokens |Yes|

### Return on Success (Promise.resolve())

```javascript
{
    // General information of the overall WealthSimple Trade account
    ...
}
```

<a id="getHistory"></a>

## **trade**.getHistory(*tokens*, *interval*, *accountId*) -> **Promise\<result\>**


Captures a snapshot of the performance for a specific account
in the provided time interval.


| Parameters|Required|Allowed values    
|----------|---------------------|-----------|
| tokens |Yes||
| interval |Yes|1d, 1w, 1m, 3m, 1y|
| accountId |Yes||

### Return on Success (Promise.resolve())

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

<a id="getBankAccounts"></a>


## **trade**.getBankAccounts(*tokens*) -> **Promise\<result\>**


Provides a list of the bank accounts that have been linked to the WealthSimple Trade account.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success (Promise.resolve())

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

<a id="getDeposits"></a>

## **trade**.getDeposits(*tokens*) -> **Promise\<result\>**


All deposits (in progress, completed, and cancelled) made to the WealthSimple Trade account.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success (Promise.resolve())

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

<a id="getExchangeRates"></a>


## **trade**.getExchangeRates(*tokens*) -> **Promise\<result\>**

Provides the current USD/CAD conversion rates for the WealthSimple Trade platform.


| Parameters|Required| 
|----------|---------------------|
| tokens |Yes|

### Return on Success (Promise.resolve())

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

### Return on Success (Promise.resolve())

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

<a id="getOrders"></a>

## **trade**.getOrders(*tokens*, *accountId*) -> **Promise\<result\>**

Grabs all orders (filled, pending, and cancelled) from a specific account under the WealthSimple Trade account.



| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountID|Yes|

### Return on Success (Promise.resolve())

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

<a id="getPendingOrders"></a>

## **trade**.getPendingOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all pending orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the pending orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountID|Yes|
| ticker   |No

### Return on Success (Promise.resolve())

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

<a id="getFilledOrders"></a>

## **trade**.getFilledOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all filled orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the filled orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountID|Yes|
| ticker   |No

### Return on Success (Promise.resolve())

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

<a id="getCancelledOrders"></a>

## **trade**.getCancelledOrders(*tokens*, *accountId*, *[ticker]*) -> **Promise\<result\>**

Grabs all cancelled orders for the specified account under the WealthSimple Trade account.

**Note**: You may restrict the cancelled orders to a specific security by providing the ticker.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountID|Yes|
| ticker   |No

### Return on Success (Promise.resolve())

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

    // Total number of filled orders
    total: XXX
}
```

<a id="cancelOrder"></a>

## **trade**.cancelOrder(*tokens*, *orderId*) -> **Promise\<result\>**

Attempts to cancels the order associated with the provided orderId.

**Note**: The order might NOT be cancelled if it was filled by WealthSimple Trade. This has nothing to do with this wrapper; be cautious!


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| orderId|Yes|

### Return on Success (Promise.resolve())

```javascript
{
    // Information regarding the cancellation of the order
    ...
}
```

<a id="cancelPendingOrders"></a>

## **trade**.cancelPendingOrders(*tokens*, *accountId*) -> **Promise\<result\>**

Place a cancellation order for all pending orders in the provided account.

**Note**: The orders might NOT be cancelled if it was filled by WealthSimple Trade. This has nothing to do with this wrapper; be cautious!


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId|Yes|

### Return on Success (Promise.resolve())

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

<a id="getSecurityId"></a>

## **trade**.getSecurityId(*tokens*, *ticker*) -> **Promise\<result\>**

Provides the security id of the ticker (used internally by WealthSimple Trade).


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| ticker |Yes|

### Return on Success (Promise.resolve())

```javascript
'sec-XXXXXXXXXX'
```

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




### Return on Success (Promise.resolve())

```javascript
{
    // Confirmation and details of the limit buy
    ...
}
```

<a id="placeLimitSell"></a>

## **trade**.placeLimitSell(*tokens*,*accountId*, *ticker*, *limit*, *quantity*) -> **Promise\<result\>** ##

Attempts to sell a given quantity of a security at a minimum price.


| Parameters|Required|
|----------|---------------------|
| tokens |Yes|
| accountId |Yes|
| ticker |Yes|
| limit |Yes|
| quantity |Yes|


### Return on Success (Promise.resolve())

```javascript
{
    // Confirmation and details of the limit sell
    ...
}
```

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
