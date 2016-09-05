/* eslint-disable no-undef */

exports.name         = 'add-admin-user';
exports.description  = 'Adds the first admin user for keepers organization';

exports.isReversible = true;
exports.isIgnored    = false;


exports.up = function(db, done) {
  db.collection('users').insertOne({
    _id           : new ObjectId('2672de4ca8191fba756d383b'),
    userCredential: new ObjectId('bc5a086097d9479e93ce5979'),
    role          : 'admin',
    account       : new ObjectId('5772de4ca8191fbe7ddfa81e'),
    name          : 'Admin User',
    email         : 'admin@fintechdev.net',
    phoneNumber   : '778-123-4567',
    username      : 'adminFintech',
    metaData      : {},
    createdAt     : new Date(),
    updatedAt     : new Date(),
    __v           : 0
  }, (err) => done(err));
};

exports.down = function(db, done) {
  db.collection('accounts').removeOne({
    _id: new ObjectId('2672de4ca8191fba756d383b')
  }, (err) => done(err));
};
