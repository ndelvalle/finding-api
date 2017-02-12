const milieu = require('milieu');

const config = milieu('api', {
  env: 'DEV',
  server: {
    port           : '${PORT}',
    maxResultsLimit: 1000
  },
  mongo: {
    url: 'mongodb://localhost/api'
  },
  service: {
    urls : {
      NotificationD: 'http://localhost:8000'
    }
  },
  cors: {

  },
  logger: {
    sentry: {
      dsn: '${SENTRY_DSN}'
    },
    console: {
      level                          : 'silly',
      timestamp                      : true,
      handleExceptions               : true,
      humanReadableUnhandledException: true,
      colorize                       : true
    },
    loggly: {
      inputToken: '${LOGGLY_TOKEN}',
      subdomain : '${LOGGLY_DOMAIN}',
      tags: ['findearth-api-dev'],
      json: true
    }
  },
  auth0: {
    clientID    : '${AUTH0_CLIENT_ID}',
    clientSecret: '${AUTH0_CLIENT_SECRET}',
    token       : '${AUTH0_TOKEN}',
    domain      : 'keepers-co.auth0.com',
    callbackURL : '/auth/db-callback',
    authURL     : 'https://keepers-co.auth0.com/oauth/ro',
    connections : { db: 'Username-Password-Authentication' },
    scope       : 'openid name email'
  },
  AWS: {
    accessKeyId    : '${AWS_ACCESS_KEY_ID}',
    secretAccessKey: '${AWS_SECRET_ACCESS_KEY}',
    region         : '${AWS_REGION}',
    bucket         : '${AWS_BUCKET}'
  }
});


module.exports = config;
