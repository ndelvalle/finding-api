const ObjectId = require('mongoose').Types.ObjectId;

const permission1 = {
  _id : new ObjectId('11ad47e540ae419411780bbf'),
  name  : 'user-read',
  action: 'GET',
  model : 'User',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
};


module.exports = permission1;
