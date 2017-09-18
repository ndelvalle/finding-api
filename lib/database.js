const Mongoose = require('mongoose').Mongoose
const mongooseTimestamp = require('mongoose-cu-timestamps')
const mongooseCountAndFind = require('mongoose-count-and-find')

const roleSchema = require('../schema/role')
const personSchema = require('../schema/person')
const personRequestSchema = require('../schema/person-request')
const permissionSchema = require('../schema/permission')
const organizationSchema = require('../schema/organization')
const contributorSchema = require('../schema/contributor')

class Database {
  constructor (config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'Database' })

    this.logger.verbose('Creating mongoose instance')
    this.mongoose = new Mongoose()
    this.logger.verbose('Mongoose instance created')

    this._setupMongoosePlugins()
    this._setupMongooseModels()
  }

  connect (cb) {
    this.logger.verbose('Connecting to database')
    this.mongoose.connect(this.config.mongo.url, (err) => {
      if (err) { return cb(err) }

      this.logger.verbose('Connected to database')
      cb(null)
    })
  }

  disconnect (cb) {
    this.logger.verbose('Disconnecting from database')
    this.mongoose.disconnect((err) => {
      if (err) { return cb(err) }
      this.logger.verbose('Disconnected from database')
      cb(null)
    })
  }

  model (...args) {
    return this.mongoose.model(...args)
  }

  ping (cb) {
    if (!this.mongoose.connection.db) {
      return cb(new Error('Not connected to database'))
    }

    this.mongoose.connection.db.admin().ping((err, result) => {
      if (err) { return cb(err) }
      cb(null, result)
    })
  }

  _setupMongoosePlugins () {
    this.logger.verbose('Attaching plugins')
    this.mongoose.plugin(mongooseTimestamp)
    this.mongoose.plugin(mongooseCountAndFind)
    this.logger.verbose('Plugins attached')
  }

  _setupMongooseModels () {
    this.logger.verbose('Registering models')
    this.mongoose.model('Role', roleSchema)
    this.mongoose.model('Permission', permissionSchema)
    this.mongoose.model('Organization', organizationSchema)
    this.mongoose.model('PersonRequest', personRequestSchema)
    this.mongoose.model('Person', personSchema, 'persons')
    this.mongoose.model('Contributor', contributorSchema)
    this.logger.verbose('Models registered')
  }
}

module.exports = Database
