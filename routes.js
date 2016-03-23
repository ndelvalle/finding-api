'use strict';

var router = require('express').Router();

var controllers = require('./controllers');

router.get('/', function(req, res) {
  res.json({
    message: 'Welcome to Missing Person API!'
  });
});

router.route('/missing')
  .get(controllers.missing.find.bind(controllers.missing));


module.exports = router;
