'use strict';

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/missing',
  ENV: process.env.NODE_ENV || 'development'
};
