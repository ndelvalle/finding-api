const config = require('../config');

config.server.port = 8050;

config.mongo.url  = 'mongodb://localhost/api-test';
config.logger     = {};

config.auth0.clientID     = 'aaa';
config.auth0.clientSecret = 'bbb';
config.auth0.token        = 'ccc';

config.AWS.accessKeyId     = '000';
config.AWS.secretAccessKey = '111';
config.AWS.region          = '222';
config.AWS.bucket          = '333';

module.exports = config;
