// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { auth } from 'wstrade-api';

/**
 * Logging in requires a One-Time Password (OTP) event handler
 * to be registered with the auth.on API.
 * 
 * Below are two distinct examples of providing the OTP.
 */


// The OTP value here is a string literal. This will tell auth.login to automatically
// pass this value as part of the login request. It is assumed that you derived this
// OTP string literal manually.
auth.on('otp', '172829');

// The OTP value here is brought into the system automatically at run-time.
//
// This stubbed function is supposed to resemble a function that can
// connect to Gmail API and get the OTP code automatically.
const getCodeFromGmail = async () => {
    let gmail_otp = null;

    // logic to connect to gmail, get OTP and assign it to gmail_otp.
    // You might want to have a sleep in here for 5 seconds to allow for Wealthsimple Trade
    // to dispatch the OTP to your email.

    return gmail_otp;
}

// getCodeFromGmail will be called by auth.login. Since it knows getCodeFromGmail is a function
// and not a string literal, auth.login will do the following:
//
// * attempt to login without OTP, failing to login but successfully dispatching an OTP
// * Invokes your OTP function to get the OTP (in this example, getCodeFromGmail)
// * Attempt to login for a second time with the OTP returned by getCodeFromGmail.
auth.on('otp', getCodeFromGmail);

/**
 * Now that we understand how to specify the OTP, let's talk about
 * using the auth.login API.
 */


 (async () => {
    
    // To login, provide the email and password combination.
    // auth.login will handle the OTP part according to how you configured
    // it as discussed above.
    await auth.login('example@hotmail.ca', 'mypassword');

    // if you wanted to check the current authentication tokens, use the
    // auth.tokens API
    const currentTokens = auth.tokens();
    // Output:
    // {
    //   access: 'm8GKZp_wdnnae4JnqUmpNInZli-IkP9escCGcvwEsTQ',
    //   refresh: 'O3xScrMpYlPxdaDu2QM-yS-YlJS8s4jwZYZlHbt5RC0',
    //   expires: 1607137004
    // };


    // if you already have the authenticaiton tokens handy, you can use
    // the auth.use API to load them in directly without having to log in
    // again.
    auth.use({
        access: 'm8GKZp_wdnnae4JnqUmpNInZli-IkP9escCGcvwEsTQ',
        refresh: 'O3xScrMpYlPxdaDu2QM-yS-YlJS8s4jwZYZlHbt5RC0',
        expires: 1607137004  
    });

    // If you wish to generate a new set of access and refresh tokens, you can do
    // so by invoking auth.refresh. This will take your existing auth.tokens.refresh
    // token and generate new access and refresh tokens from the Wealthsimple Trade servers.
    //
    // Keep in mind that wstrade-api does implicitly refresh access tokens when they expire.
    await auth.refresh();
 })()
 .catch(error => console.log(error));
