require('dotenv').config();
const milieu = require('milieu');

const config = milieu('api', {
  server: {
    url            : 'http://localhost:8000',
    maxResultsLimit: 1000
  },
  mongo: {
    url: 'mongodb://localhost/api'
  },
  cors: {

  },
  logger: {
    sentry: {
      dsn: ''
    },
    console: {
      level                          : 'silly',
      timestamp                      : true,
      handleExceptions               : true,
      humanReadableUnhandledException: true,
      colorize                       : true
    }
  },
  auth0: {
    clientID    : process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain      : 'keepers-co.auth0.com',
    callbackURL : '/auth/db-callback',
    authURL     : 'https://keepers-co.auth0.com/oauth/ro',
    connections : { db: 'Username-Password-Authentication' },
    scope       : 'openid name email'
  }
});


module.exports = config;
