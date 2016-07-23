const MongoClient = require('mongodb').MongoClient;
const config      = require('./config');


module.exports = function(nomad) {

  nomad.driver({
    connect(cb) {
      MongoClient.connect(config.mongo.url, (err, db) => {
        if (err) { return cb(err); }
        this.db = db;
        cb(null, db);
      });
    },

    disconnect(cb) {
      this.db.close(cb);
    },

    createMigration(migration, cb) {
      this.db.collection('migrations').insertOne(migration, cb);
    },

    updateMigration(filename, migration, cb) {
      this.db.collection('migrations').updateOne({
        filename
      }, {
        $set: migration
      }, cb);
    },

    getMigrations(cb) {
      this.db.collection('migrations').find().toArray(cb);
    }
  });
};
