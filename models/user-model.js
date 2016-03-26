'use strict';

var bcrypt = require('bcrypt');

var Model = require('../libraries/model');
var User = require('../schemas/user-schema');

var UserModel = class extends Model {

  constructor(SchemaModel) {
    super(SchemaModel);
  }

  comparePassword(password, hash) {
    return bcrypt.compareAsync(password, hash);
  }
};

module.exports = new UserModel(User);
