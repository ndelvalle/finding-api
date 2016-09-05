/* eslint-disable no-undef */

exports.name         = 'add-admin-role';
exports.description  = 'Adds the admin role';

exports.isReversible = true;
exports.isIgnored    = false;


exports.up = function(db, done) {
  db.collection('roles').insertOne({
    _id         : new ObjectId('57a2cada0e8c0d408651e6ff'),
    name        : 'Admin',
    description : 'Chuck Norris',
    createdAt   : new Date(),
    updatedAt   : new Date(),
    __v         : 0
  }, (err) => done(err));
};

exports.down = function(db, done) {
  db.collection('roles').removeOne({
    _id: new ObjectId('57a2cada0e8c0d408651e6ff')
  }, (err) => done(err));
};
