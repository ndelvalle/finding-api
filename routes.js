'use strict';

var router = require('express').Router();

var controllers = require('./controllers');

router.get('/', function(req, res) {
  res.json({
    message: 'Welcome to Missing Person API!'
  });
});
/*
router.route('/people')
  .get(controllers.user.find.bind(controllers.user));
*/

module.exports = router;
