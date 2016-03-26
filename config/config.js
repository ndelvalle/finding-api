'use strict';

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/missing',
  ENV: process.env.NODE_ENV || 'development',
  JWT: {
    KEY: process.env.JWT_KEY || '92601aa638620ae31418',
    EXPIRATION: process.env.JWT_EXPIRATION ||  86400 // 1 day
  }
};
