// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { auth, orders, accounts, quotes } from 'wstrade-api';

(async () => {

    // OTP is manually provided here for the sake of simplicity.
    // Visit the auth module examples for guidance on how to setup OTP with auth.on API through
    // an automatic function that retrieves the OTP.
    auth.on('otp', '182923');
    await auth.login('jane@doe.ca', 'mypassword');

    // We need to start off by getting the accounts that Jane has.
    let accs = await accounts.all();

    // Retrieve the 2nd page of orders in Jane's TFSA.
    let page2Orders = await orders.page(accs.tfsa, 2);

    // Retrieve all orders in Jane's personal account.
    let allOrders = await orders.all(accs.personal);

    // Retrieve all pending orders in Jane's personal account.
    let pendingOrders = await orders.pending(accs.personal);

    // Retrieve pending orders for AAPL (Apple) in Jane's personal account.
    let pendingAapl = await orders.pending(accs.personal, 'AAPL:NASDAQ');

    // Retrieve filled orders for SU (Suncor) in Jane's TFSA.
    let filledSu = await orders.filled(accs.tfsa, 'SU:TSX');

    // Retrieve cancelled orders for UBER (Uber) in Jane's personal account.
    let cancelledUber = await orders.cancelled(accs.personal, 'UBER:NYSE');

    // Cancels the first order in the pendingOrders list.
    let cancelPendingHead = await orders.cancel(pendingOrders.orders[0].external_order_id);

    // Cancel all pending orders in Jane's TFSA.
    let cancelAllPending = await orders.cancel(accs.tfsa);


    /**
     * Purchasing securities
     */

    // Place a market buy for 6 shares of AAPL (Apple) in Jane's personal account.
    let marketBuyAapl = await orders.marketBuy(accs.personal, 'AAPL:NASDAQ', 6);

    // Place a limit buy for 10 shares of Uber in Jane's TFSA
    // Since we know WealthSimple Trade's quotes are 15 minutes delayed, Jane is fine
    // with paying up to $1/share more from WealthSimple Trade's delayed quotes.
    let uberPrice = await quotes.get('UBER:NYSE');
    let limitUberPrice = uberPrice + 1;
    let limitBuyUber = await orders.limitBuy(accs.tfsa, 'UBER:NYSE', limitUberPrice, 10);

    // Place a stop limit buy for 10 shares of Uber in Jane's TFSA
    // Jane decided to set the stop price at $0.5 more than WealthSimple Trade's quote for UBER.
    // If the stock bypasses that, the order will be converted to a limit order and use
    // limitUberPrice, which is $1 more than the current quote for UBER.
    let stopUberPrice = uberPrice + 0.5;
    let stopLimitBuyUber = await orders.stopLimitBuy(accs.tfsa, 'UBER:NYSE', stopUberPrice, limitUberPrice, 10);


    /**
     * Selling securities
     */

    // Place a market sell for 5 shares of SU (Suncor) in Jane's TFSA
    let marketSellSu = await orders.marketSell(accs.tfsa, 'SU:TSX', 5);

    // Place a limit sell for 10 shares of Netflix in Jane's TFSA
    // Since we know WealthSimple Trade's quotes are 15 minutes delayed, Jane is fine
    // with sell $0.5/share less than WealthSimple Trade's delayed quotes.
    let nflxPrice = await quotes.get('NFLX:NASDAQ');
    let limitNflxPrice = nflxPrice - 0.5;
    let limitSellNflx = await orders.limitBuy(accs.tfsa, 'NFLX:NASDAQ', limitNflxPrice, 10);

    // Place a stop limit sell for 10 shares of Suncor in Jane's TFSA
    // Jane decided to set the stop price at $0.25 less than WealthSimple Trade's quote for Suncor.
    // If the stock bypasses that, the order will be converted to a limit order and use
    // limitSuPrice, which is also $0.25 less than the current quote for Suncor.
    //
    // The stop and limit prices are the same here because of a TSX/TSX-V limitation
    // (enforced by WealthSimple Trade) that requires stop and limit prices to be the same.
    let suPrice = await quotes.get('SU:TSX');
    let limitSuPrice = suPrice - 0.25
    let stopSuPrice = suPrice;
    let stopLimitSellSu = await orders.stopLimitBuy(accs.tfsa, 'UBER:NYSE', limitSuPrice, stopSuPrice, 10);
})().catch(error => console.log(error));