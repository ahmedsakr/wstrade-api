// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/tree/api-examples/docs#importing-wstrade-api-commonjs-es6

import { auth, accounts } from 'wstrade-api';

(async () => {

    // OTP is manually provided here for the sake of simplicity.
    // Visit the auth module examples for guidance on how to setup OTP with auth.on API through
    // an automatic function that retrieves the OTP.
    auth.on('otp', '182923');
    await auth.login('jane@doe.ca', 'mypassword');


    /*
     * Let's get the open accounts under Jane's WealthSimple Trade account.
     */
    let openAccs = await accounts.all();
    console.log(openAccs);
    // Output:
    // {
    //    tfsa: 'tfsa-zzzzzzzz',
    //    rrsp: undefined,
    //    crypto: 'non-registered-crypto-zzzzzzz',
    //    personal: 'non-registered-zzzzzzzz'
    // }

    // Information about Jane's open accounts
    let accsData = await accounts.data();

    // Information about Jane's WealthSimple Trade parent account
    let tradeAccount = await accounts.me();

    // Information that Jane used to open her WealthSimple Trade parent account
    let janeInfo = await accounts.person();

    // History of Jane's TFSA in the past 3 months.
    let threeMonthsPerformance = await accounts.history('3m', openAccs.tfsa);

    // History of Jane's crypto in the past year.
    let threeMonthsPerformance = await accounts.history('1y', openAccs.crypto);

    // Recent activity on Jane's WealthSimple Trade account
    let activity = await accounts.activities();

    // Bank accounts that Jane has linked to her WealthSimple Trade account
    let banks = await accounts.getBankAccounts();

    // Deposits that Jane has made to her WealhSimple Trade account
    let deposits = await accounts.deposits();

    // Jane's current positions in her personal account
    let personalPositions = await accounts.positions(openAccs.personal);
})().catch(error => console.log(error));