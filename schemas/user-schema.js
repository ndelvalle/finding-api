'use strict';

var bcrypt = require('bcrypt');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  }

});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  // generate a salt
  bcrypt.genSaltAsync(SALT_WORK_FACTOR)
  .then(function(salt) {
    // hash the password along with the new salt
    return bcrypt.hashAsync(user.password, salt);
  })
  .then(function(hash) {
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = mongoose.model('User', UserSchema);
