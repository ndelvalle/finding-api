const milieu = require('milieu');

const config = milieu('api', {
  server: {
    port           : process.env.PORT || 9090,
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
    token       : process.env.AUTH0_TOKEN,
    domain      : 'keepers-co.auth0.com',
    callbackURL : '/auth/db-callback',
    authURL     : 'https://keepers-co.auth0.com/oauth/ro',
    connections : { db: 'Username-Password-Authentication' },
    scope       : 'openid name email'
  },
  AWS: {
    accessKeyId    : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region         : process.env.AWS_REGION,
    bucket         : process.env.AWS_BUCKET
  }
});


module.exports = config;
