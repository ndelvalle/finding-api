const config = require('../config');

config.server.url = 'http://localhost:8050';

config.mongo.url  = 'mongodb://localhost/api-test';
config.logger     = {};

config.auth0.clientID = 'aGVsbG8=';
config.auth0.clientSecret = 'aGVsbG8=';

module.exports = config;
