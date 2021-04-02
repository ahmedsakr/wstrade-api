import { auth, orders, Session } from 'wstrade-api';

// A default session is exported by the lbirary and you can directly
// utilize it with all the availables modules
auth.use(...);
orders.marketBuy(...);

// if you require independent sessions for concurrent usecases,
// you can go ahead and create more sessions!
const user1 = new Session();
// Just remember - you need to setup the authentication state
// for every session you create.
user1.auth.use(...);

// this request is fulfilled with the authentication state from user1's
// session.
user1.data.getSecurity('AAPL:NASDAQ');

// Don't be shy - keep making more sessions if you need them.
const user2 = new Session();
const user3 = new Session();
const user4 = new Session();
const user5 = new Session();