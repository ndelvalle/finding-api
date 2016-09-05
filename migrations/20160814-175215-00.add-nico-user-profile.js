/* eslint-disable no-undef */

exports.name         = 'add-admin-user';
exports.description  = 'Adds the first admin user for keepers organization';

exports.isReversible = true;
exports.isIgnored    = false;


exports.up = function(db, done) {
  db.collection('users').insertOne({
    _id          : new ObjectId('57ad49a3cc8672aa14006c19'),
    role         : new ObjectId('57a2cada0e8c0d408651e6ff'),
    organization : new ObjectId('57ad47e540ae419411780bbf'),
    auth0        : 'auth0|57cd8f43c8e03ccc37822abd',
    createdAt    : new Date(),
    updatedAt    : new Date(),
    __v          : 0
  }, (err) => done(err));
};

exports.down = function(db, done) {
  db.collection('accounts').removeOne({
    _id: new ObjectId('57ad49a3cc8672aa14006c19')
  }, (err) => done(err));
};
