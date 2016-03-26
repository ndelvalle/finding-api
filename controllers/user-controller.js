'use strict';

var config = require('../config/config');
var jwt = require('jsonwebtoken');

var Controller = require('../libraries/controller');
var UserModel = require('../models/user-model');

var UserController = class extends Controller {
  constructor(Model) {
    super(Model);
  }

  authenticate(req, res, next) {
    var self = this;

    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
      return res.status(401).send('Authentication failed. Username and password must be provided.');
    }

    self.model.findOne({ username: { $regex: new RegExp(username, 'i')} })
    .then(function(user) {
      if (!user) {
        return res.status(401).send('Authentication failed. Username and password do not match.');
      }
      self.user = user;

      return self.model.comparePassword(password, user.password);
    })
    .then(function(isCorrectPassword) {
      if (!isCorrectPassword) {
        return res.status(401).send('Authentication failed. Username and password do not match.');
      }

      var token = jwt.sign(self.user, config.JWT.KEY, {
        expiresIn: config.JWT.EXPIRATION
      });

      res.status(200).json({
        token: token
      });
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
  }
};

module.exports = new UserController(UserModel);
