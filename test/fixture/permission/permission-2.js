const ObjectId = require('mongoose').Types.ObjectId;

const permission2 = {
  _id : new ObjectId('22ad47e540ae419411780bbf'),
  name  : 'user-write',
  action: 'POST',
  model : 'User',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
};


module.exports = permission2;
