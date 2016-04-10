'use strict';

var config = require('../config/config');

var mongoose = require('mongoose');
var Promise  = require('bluebird');

var User = require('../models/user-model');

Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);

User.create({
  username: 'admin',
  password: 'admin',
  isAdmin: true
})
.then(function(user) {
  console.log('User ' + user.username + ' has been created.');
  process.exit();
})
.catch(function(err) {
  console.log(err);
  process.exit(1);
});
