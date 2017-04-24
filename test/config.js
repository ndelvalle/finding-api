const config = require('../config')

config.server.port = 8050

config.mongo.url = 'mongodb://localhost/findearth-test'
config.logger = {}

config.auth0.clientId = 'aaa'
config.auth0.clientSecret = 'bbb'
config.auth0.token = 'ccc'

config.aws.accessKeyId = '000'
config.aws.secretAccessKey = '111'
config.aws.region = '222'
config.aws.bucket = '333'

module.exports = config
