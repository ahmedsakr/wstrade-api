// ES6 syntax is used here. Please refer to the link below for importing
// wstrade-api in CommonJS:
// https://github.com/ahmedsakr/wstrade-api/docs#importing-wstrade-api-commonjs-es6

import { config } from 'wstrade-api';

// Disable the implicit_token_refresh feature.
// You will be required to manually invoke auth.refresh when your
// tokens expire.
config('no_implicit_token_refresh');

// Enable the implicit_token_refresh feature.
config('implicit_token_refresh');
