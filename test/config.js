const config = require('../config');

config.server.port = 8050;

config.mongo.url  = 'mongodb://localhost/api-test';
config.logger     = {};

module.exports = config;
