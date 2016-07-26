const expressJWT = require('express-jwt');
const config     = require('../config');

const jwtMiddleware = {};

jwtMiddleware.auth = expressJWT({
  secret  : new Buffer(config.auth0.clientSecret, 'base64'),
  audience: config.auth0.clientID
}).unless({ path: ['/', '/status', '/auth'] });

module.exports = jwtMiddleware;
