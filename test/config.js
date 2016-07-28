const config = require('../config');

config.server.port = 8050;

config.mongo.url  = 'mongodb://localhost/api-test';
config.logger     = {};

config.auth0.clientID     = 'aaa';
config.auth0.clientSecret = 'bbb';
config.auth0.token        = 'ccc';

module.exports = config;
