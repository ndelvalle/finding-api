const milieu = require('milieu');


const config = milieu('api', {
  server: {
    port           : process.env.PORT || 8080,
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
  }
});


module.exports = config;
