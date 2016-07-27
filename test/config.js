const config = require('../config');

config.server.url = 'http://localhost:8050';

config.mongo.url  = 'mongodb://localhost/api-test';
config.logger     = {};

config.auth0.clientID     = 'xR4YV0J5DXlN45LFCSja5WWradAPf0LO';
config.auth0.clientSecret = 'QxIyDhFGOzYCGdgGPmlprJH93P-tkyGLRpwHAMBCQyU1NioUwnUCXHiVFg6ATQSx';

module.exports = config;
