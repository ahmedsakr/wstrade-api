<div style="max-height: 50px; max-width: 150px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/900px-JavaScript-logo.png" width="50px" height="50px">
<img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" width="50px" height="50px">
</div>

### [Documentation and Examples](/docs)

###   ⚠️⚠️ **Version 0 (`0.x.x`) will only be supported with hotfixes until **February 28, 2021**. Please start planning migration to Version 1**.
# wstrade-api

A tiny Unofficial Wealthsimple Trade API Wrapper for JavaScript, supporting the core abilities of the Wealthsimple Trade application including placing orders, viewing and cancelling orders, and more.

## Disclaimer

* **USE AT YOUR OWN RISK**. This is an unofficial Wealthsimple Trade API Wrapper.
*  **DO NOT LEVERAGE THIS IN ATTEMPT TO DISRUPT ORDERLY MARKET FUNCTIONS**. This package is provided to you so you can
build cool shit with it, but you should understand that you have a responsibility to not engage in illegal trading behaviours that can disrupt orderly market functions.

## Deprecated Versions
* Versions `< v0.11.0` are deprecated due to one-time passwords (OTP) becoming mandatory.
* Versions `<= v0.9.0` are deprecated due to a WS Trade architecture change in handling buy and sell APIs. These old versions
will work for everything except buying and selling. Upgrade to a later version if you wish to use the buying and selling
APIs.

## Server-Side Limitation

This wrapper will not work when executed on the client-side due to the underlying CORS security limitation imposed by the Wealthsimple Trade endpoints.
If you wish to build a front-end application, you will have to design an architecture where the server
does all of the API calls.

## Getting Started

Before playing with **wstrade-api**, you must have a valid
Wealthsimple Trade account to authenticate against. If you have not signed up for Wealthsimple Trade, you may download the iOS application [here](https://apps.apple.com/ca/app/wealthsimple-trade/id1403491709) or the android application [here](https://play.google.com/store/apps/details?id=com.wealthsimple.trade&hl=en_CA).

### Prerequisites

You just need node.js — and npm, obviously.

### Dependencies

The dependency list is tiny — **node-fetch** and **source-map-support**. They will be automatically installed when you install `wstrade-api` through `npm`.

### Installing

Install **wstrade-api** from the npm registry

```
npm i wstrade-api
```

You could also clone the GitHub repository

```
git clone git@github.com:ahmedsakr/wstrade-api.git
```

## Contributing
* Read the contributing document [here](/Contributing.md).
* After that, Feel free to fork the GitHub repository, make any changes, and contribute by setting up a pull request.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Ahmed Sakr** - *Owner* - [@ahmedsakr](https://github.com/ahmedsakr)
* **Mitchell Sawatzky** - *Contributor* - [@bufutda](https://github.com/bufutda)

## License

This project is licensed under the MIT License.

## Acknowledgments

A huge thanks to the contributors of [this](https://github.com/MarkGalloway/wealthsimple-trade/) repository for providing an elegant API documentation.
