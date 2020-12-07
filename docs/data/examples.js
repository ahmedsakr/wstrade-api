// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { auth, data } from 'wstrade-api';

(async () => {

    // OTP is manually provided here for the sake of simplicity.
    // Visit the auth module examples for guidance on how to setup OTP with auth.on API through
    // an automatic function that retrieves the OTP.
    auth.on('otp', '182923');
    await auth.login('jane@doe.ca', 'mypassword');

    // Lets grab the current USD/CAD exchange rates on the platform
    let rates = await data.exchangeRates();

    // Retrieving the basic information the apple stock
    let aaplInfo = await data.getSecurity('AAPL:NASDAQ');

    // Retrieiving the extensive information on the apple stock, including quote of the
    // stock
    let appleExtensive = await data.getSecurity('AAPL:NASDAQ', true);
})();
