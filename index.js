const config = require('./config')
const logger = require('./logger')
const Api = require('./lib/api')

module.exports = new Api(config, logger)
exports = module.exports
exports.Api = Api
