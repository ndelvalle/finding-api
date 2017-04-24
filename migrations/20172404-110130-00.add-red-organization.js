/* eslint-disable no-undef */

exports.name = 'add-red-organization'
exports.description = 'Adds Red Soldiaria organization'

exports.isReversible = true
exports.isIgnored = false

exports.up = function (db, done) {
  db.collection('organizations').insertOne({
    _id: new ObjectId('57ad47e540ae419411780123'),
    name: 'Red Solidaria',
    description: 'Red Solirdaria Argentina',
    emails: ['hi@keepe.rs'],
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }, err => done(err))
}

exports.down = function (db, done) {
  db.collection('organizations').removeOne({
    _id: new ObjectId('57ad47e540ae419411780123')
  }, err => done(err))
}
