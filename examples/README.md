Getting started with wstrade-api
===

`wstrade-api` is capable of performing all operations that you can manually do through the UI, including:

* Retrieving current positions in your TFSA
* Retrieving filled orders in your personal account
* Placing a limit buy order for 10 shares of AAPL in your TFSA
* Placing a stop limit sell order for 25 shares of UBER in your personal account

and a lot more usecases. `wstrade-api` is developed to provide you with the progamming autonomy to control your WealthSimple Trade account.

**Architecture overview**
| module | Description |
|--|--|
| [`auth`](/examples/auth) |  Logging in, One-Time Passwords, managing 0Auth2.0 tokens |
| [`headers`](/examples/headers) |  Custom headers for rogue usecases (*you likely won't use this*) |
| [`accounts`](/examples/accounts) | Open accounts, positions, meta data, bank accounts, and so on |
| [`quotes`](/examples/quotes) | Quotes for securities, ability to custom quote source |
| [`orders`](/examples/orders) | Pending/Filled/Cancelled orders, buying/selling securities |
| [`data`](/examples/data) | Securities information, exchange rates |
| [`config`](/examples/config) | Managing conditional features of `wstrade-api` |

Click on any of the modules above to view examples of using the available APIs. It is recommended to go through the table of modules in order if you are new to `wstrade-api`.
