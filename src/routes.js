// import { user, missing } from './controllers';
import middlewares from './middlewares';
import user from './controllers/user-controller';
import missing from './controllers/missing-controller';

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

router.route('/missing/:id')
  .get(missing.findOne.bind(missing));


// private routes, need to be authenticated to acces
// @TODO: fix middlewares.auth call, default shouldn't be needed
router.use(middlewares.auth.default);

router.route('/missing/:id')
  .put(missing.update.bind(missing));

router.route('/missing')
  .post(missing.create.bind(missing));

export default router;
