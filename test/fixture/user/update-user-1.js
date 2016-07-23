const ObjectId = require('mongodb').ObjectId;


const updateUser1 = {
  _id: new ObjectId('12a3d077c143c921072e342a'),
  username: 'foobarUpdated',
  password: 'foobazUpdated'
};


module.exports = updateUser1;
