'use strict';

var router = require('express').Router();

var controllers = require('./controllers');
var middlewares = require('./middlewares');

// public routes

router.get('/', function(req, res) {
  res.json({
    message: 'Welcome to Missing People API!'
  });
});

router.route('/authenticate')
  .post(controllers.user.authenticate.bind(controllers.user));

router.route('/missing')
  .get(controllers.missing.find.bind(controllers.missing));

router.route('/missing/:id')
  .get(controllers.missing.findOne.bind(controllers.missing));


// private routes, need to be authenticated to acces

router.use(middlewares.auth);

router.route('/missing/:id')
  .put(controllers.missing.update.bind(controllers.missing));

router.route('/missing')
  .post(controllers.missing.create.bind(controllers.missing));

module.exports = router;
