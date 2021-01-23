// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { headers } from 'wstrade-api';

/**
 * The headers module provides you with the extensibility
 * to insert custom headers into all requests made to Wealthsimple Trade
 * endpoints.
 * 
 * Let's walk through some practical examples.
 */

// If you wanted to explicitly tell Wealthsimple Trade that the content is JSON,
// you can do this by adding this custom header.
// This header is not automatically inserted by wstrade-api network-level code
// as it is not necessary.
headers.add('Content-type', 'application/json');

// Let's print all custom headers.
// We expect the one we just added to be shown.
console.log(headers.values());
// Output:
// [ [ 'content-type', 'application/json' ] ]

// Let's delete the custom header now.
headers.remove('Content-type');

// We now expect this to be an empty list.
console.log(headers.values());
// Output:
// []


// We will now add more than 1 custom header, and invoke
// the headers.clear() API to remove them all.
headers.add('Content-type', 'application/json');
headers.add('device', 'iphone');
headers.clear();

console.log(headers.values());
// Output:
// []