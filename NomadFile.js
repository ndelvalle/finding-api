const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const readFileSync = require('fs').readFileSync
const config = require('./config')

module.exports = function (nomad) {
  nomad.context.ObjectId = ObjectId

  nomad.driver({
    connect (cb) {
      const mongoConfig = config.mongo
      const mongoOpts = {}

      if (mongoConfig.sslKey && mongoConfig.sslCert && mongoConfig.sslCA) {
        const subSectionName = mongoConfig.url.match(/,/) ? 'replSet' : 'server'
        mongoOpts[subSectionName] = {}
        const subSection = {}

        subSection.ssl = true
        subSection.sslValidate = mongoConfig.sslValidate
        subSection.sslCA = readFileSync(mongoConfig.sslCA)
        subSection.sslCert = readFileSync(mongoConfig.sslCert)
        subSection.sslKey = readFileSync(mongoConfig.sslKey)
        subSection.sslPass = mongoConfig.sslPass
      }

      MongoClient.connect(mongoConfig.url, mongoOpts, (err, db) => {
        if (err) { return cb(err) }
        this.db = db
        cb(null, db)
      })
    },

    disconnect (cb) {
      this.db.close(cb)
    },

    createMigration (migration, cb) {
      this.db.collection('migrations').insertOne(migration, cb)
    },

    updateMigration (filename, migration, cb) {
      this.db.collection('migrations').updateOne({
        filename
      }, {
        $set: migration
      }, cb)
    },

    getMigrations (cb) {
      this.db.collection('migrations').find().toArray(cb)
    }
  })
}
