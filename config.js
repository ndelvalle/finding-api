const milieu = require('milieu')

const config = milieu('api', {
  env: 'DEV',
  server: {
    port: '9090',
    maxResultsLimit: 1000
  },
  mongo: {
    url: 'mongodb://localhost/findearth'
  },
  cors: {},
  logger: {
    console: {
      level: 'debug',
      timestamp: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      colorize: true
    }
  },
  auth0: {
    clientId: '',
    clientSecret: '',
    token: '',
    domain: 'keepers.auth0.com',
    callbackURL: '/auth/db-callback',
    authURL: 'https://keepers.auth0.com/oauth/ro',
    connections: { db: 'Username-Password-Authentication' },
    scope: 'openid name email user_metadata'
  },
  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucket: 'qa-findearth'
  }
})

module.exports = config
