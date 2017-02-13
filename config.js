const milieu = require('milieu');

const config = milieu('api', {
  env: 'DEV',
  server: {
    port           : '9090',
    maxResultsLimit: 1000
  },
  mongo: {
    url: 'mongodb://localhost/findearth'
  },
  service: {
    urls : {
      NotificationD: 'http://localhost:8000'
    }
  },
  cors: {},
  logger: {
    console: {
      level                          : 'silly',
      timestamp                      : true,
      handleExceptions               : true,
      humanReadableUnhandledException: true,
      colorize                       : true
    },
    loggly: {
      inputToken: '',
      subdomain : 'keepers',
      tags      : ['findearth-api-dev'],
      json      : true
    }
  },
  auth0: {
    clientID    : '',
    clientSecret: '',
    token       : '',
    domain      : 'keepers-co.auth0.com',
    callbackURL : '/auth/db-callback',
    authURL     : 'https://keepers-co.auth0.com/oauth/ro',
    connections : { db: 'Username-Password-Authentication' },
    scope       : 'openid name email'
  },
  aws: {
    accessKeyId    : '',
    secretAccessKey: '',
    region         : '',
    bucket         : ''
  }
});


module.exports = config;
