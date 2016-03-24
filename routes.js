'use strict';

var router = require('express').Router();

var controllers = require('./controllers');

router.get('/', function(req, res) {
  res.json({
    message: 'Welcome to Missing People API!'
  });
});

router.route('/missing')
.get(controllers.missing.find.bind(controllers.missing))
.post(controllers.missing.create.bind(controllers.missing));

router.route('/missing/:id')
  .get(controllers.missing.findOne.bind(controllers.missing))
  .put(controllers.missing.update.bind(controllers.missing));

module.exports = router;
