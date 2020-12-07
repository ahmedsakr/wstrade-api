// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { auth, quotes } from 'wstrade-api';

(async () => {

    // OTP is manually provided here for the sake of simplicity.
    // Visit the auth module examples for guidance on how to setup OTP with auth.on API through
    // an automatic function that retrieves the OTP.
    auth.on('otp', '182923');
    await auth.login('jane@doe.ca', 'mypassword');

    /**
     * We are providing a custom quote provider for NASDAQ-listed securities.
     * 
     * Our custom quote provider in this example is simply return 42 all the time. However,
     * you can still hook up a real-time quote provider this way for your use case!
     */
    quotes.use('NASDAQ', {
        get: async (ticker) => {
            return 42;
        }
    });

    // Since AAPL (Apple) is NASDAQ-listed (which quotes.get will determine), it
    // will invoke the custom provider we supplied above and return 42 - always!
    let aaplValue = await quotes.get('AAPL');

    // Since SU (Suncor) is TSX-listed, it will not be affected by our custom provider
    // for NASDAQ-listed stocks, and quotes.get will use WealthSimple Trade endpoints to get
    // the quote for SU (Suncor).
    let suValue = await quotes.get('SU');
});