const config     = require('../config');
const expressJWT = require('express-jwt');

const authentication = expressJWT({
  secret  : config.auth0.clientSecret,
  audience: config.auth0.clientId
});


module.exports = authentication;
