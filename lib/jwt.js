const config     = require('../config');
const expressJWT = require('express-jwt');

const jwtMiddleware = {};

// TODO: Temporal fix until find a better solution :)
if (config.env !== 'UT') {
  jwtMiddleware.auth = expressJWT({
    secret  : new Buffer(config.auth0.clientSecret, 'base64'),
    audience: config.auth0.clientID
  }).unless({ path: ['/', '/status', '/auth'] });
} else {
  jwtMiddleware.auth = (req, res, next) => next(null);
}

module.exports = jwtMiddleware;
