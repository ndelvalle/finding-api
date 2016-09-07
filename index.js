require('@risingstack/trace');

const config = require('./config');
const logger = require('./logger');
const Api    = require('./lib/api');


exports = module.exports = new Api(config, logger);
exports.Api = Api;
