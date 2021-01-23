require('source-map-support').install();

const auth = require('./auth').default;
const headers = require('./headers').default;
const accounts = require('./accounts').default;
const orders = require('./orders').default;
const data = require('./data').default;
const quotes = require('./quotes').default;
const config = require('./config').default;

module.exports = {
  auth,
  headers,
  accounts,
  orders,
  quotes,
  data,
  config,
};
