# Ticker

WealthSimple Trade supports securities from 4 exchanges:
* `NASDAQ`
* `NYSE`
* `TSX`
* `TSX-V`

You will notice that some APIs require a ticker as a parameter. `wstrade-api` has incorporated a non-ambiguous way of identifying a security through its `symbol`, `exchange`, or `id`. This document will provide guidance on how you can specify the ticker argument for such APIs.

## 1. Ticker as string

You can simply specify the ticker argument as a string of the security `symbol` alone, or a composite of `symbol` and `exchange`, separated by a colon (`:`). Here are a few examples of valid tickers:
* `AAPL`
* `AAPL:NASDAQ`
* `SU:TSX`
* `BB`

The composite `symbol`:`exchange` format is useful for disambiguating which stock you are referring to. You will find that some distinct securities trade with the same ticker on different exchanges. As a result, it is recommended that you provide the `exchange` as much as you are able to.

## 2. Ticker as object

You can also provide the ticker argument as an object of `symbol` and `exchange`, or `id`. Here are a few examples of valid tickers as objects:
* `{ symbol: 'AAPL' }`
* `{ symbol: 'AAPL', exchange: 'NASDAQ' }`
*  `{ symbol: 'SU', exchange: 'TSX' }`
*  `{ symbol :  'BB' }`
*  `{ id: 'sec-s-76a7155242e8477880cbb43269235cb6' }`

The `id` shown in the last example is the internal unique security id that WealthSimple Trade assigns to each security, and can be retrieved from the [data.`getSecurity`](/docs/data) API.
