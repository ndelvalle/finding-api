const ObjectId = require('mongodb').ObjectId;


const User1 = {
  _id: new ObjectId('12a3d077c143c921072e342a'),
  username: 'foobar',
  password: '$2a$10$zT9/wglteSc8mnAtdd4j.u0T8LINkBbkW1t29MUjYaEmpjHBSm4bq',
  isAdmin : true
};


module.exports = User1;
