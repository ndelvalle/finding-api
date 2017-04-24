const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const config = require('./config')

module.exports = function (nomad) {
  nomad.context.ObjectId = ObjectId

  nomad.driver({
    connect (cb) {
      const mongoConfig = config.mongo
      const mongoOpts = {}

      if (mongoConfig.ssl) {
        const subSectionName = mongoConfig.url.match(/,/) ? 'replSet' : 'server'
        const subSection = mongoOpts[subSectionName] = {}

        subSection.ssl = true
        subSection.sslValidate = mongoConfig.ssl.validate
        subSection.sslCA = mongoConfig.ssl.ca
        subSection.sslCert = mongoConfig.ssl.cert
        subSection.sslKey = mongoConfig.ssl.key
        subSection.sslPass = mongoConfig.ssl.pass
      }

      MongoClient.connect(config.mongo.url, mongoOpts, (err, db) => {
        if (err) { return cb(err) }
        this.db = db
        cb(null, db)
      })
    },

    disconnect (cb) {
      this.db.close(cb)
    },

    insertMigration (migration, cb) {
      this.db.collection('migrations').insertOne(migration, cb)
    },

    getMigrations (cb) {
      this.db.collection('migrations').find().toArray(cb)
    },

    updateMigration (filename, migration, cb) {
      this.db.collection('migrations').updateOne({
        filename
      }, {
        $set: migration
      }, cb)
    },

    removeMigration (filename, migration, cb) {
      this.db.collection('migrations').updateOne({
        filename
      }, {
        $set: migration
      }, cb)
    }
  })
}
