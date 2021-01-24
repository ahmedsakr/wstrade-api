const trade = require('./dist');

trade.auth.tokens = {
  access: 'z987pC0Fm3A2xtXcc_3_qvdP8uEbqC91lkgTrS0OSZw',
  refresh: 'mcbgdWskCjPPX5pTn2e_TpzBrdv3iOEDcV0UoybAAlA',
  expires: 1611502078
};

//trade.auth.on('otp', '355442');

trade.quotes.use('CC', {
  quote: (ticker) => {
    console.log("yep");
    return 20;
  }
});

(async () => {
    //await trade.auth.login('ahmed@sakr.ca', '^HEXLFzvPT56^dT3');
    //console.log(trade.auth.tokens);
    //await trade.auth.login('ahmed@sakr.ca', '^HEXLFzvPT56^dT3');
    let accs = await trade.accounts.all();
    console.log(await trade.accounts.activities(accs.crypto));
})().catch(error => console.log(error));