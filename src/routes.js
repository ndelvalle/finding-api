// import { user, missing } from './controllers';
import middlewares from './middlewares';

import user from './controllers/user-controller';
import missing from './controllers/missing-controller';
import request from './controllers/request-controller';

const router = require('express').Router(); // eslint-disable-line new-cap

// public routes

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Missing People API!',
  });
});

router.route('/authenticate')
  .post(user.authenticate.bind(user));

router.route('/missing')
  .get(missing.find.bind(missing));

router.route('/missing/stats')
  .get(missing.stats.bind(missing));

router.route('/missing/:id')
  .get(missing.findOne.bind(missing));

router.route('/requests')
  .get(request.find.bind(request))
  .post(request.create.bind(request));

router.route('/requests/:id')
  .put(request.update.bind(request))
  .get(request.findOne.bind(request))
  .delete(request.remove.bind(request));

// private routes, need to be authenticated to acces
// @TODO: fix middlewares.auth call, default shouldn't be needed
router.use(middlewares.auth.default);

router.route('/missing/:id')
  .put(missing.update.bind(missing))
  .delete(missing.remove.bind(missing));

router.route('/missing')
  .post(missing.create.bind(missing));

export default router;
