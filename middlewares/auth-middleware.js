'use strict';

var config = require('../config/config');
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No token provided.'
    });
  }
  
  jwt.verifyAsync(token, config.JWT.KEY)
  .then(function(decoded) {
    req.decoded = decoded;
    next();
  })
  .catch(function(err) {
    return res.status(401).send({
      success: false,
      message: 'Failed to authenticate token.'
    });
  });
};
