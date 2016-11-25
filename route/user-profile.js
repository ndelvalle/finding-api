const Router = require('express').Router;
const router = new Router();

const jwt = require('../lib/jwt');

// TODO: Refactor to just return authenticated user profile

function findUserProfileById(req, res, next) {
  req.logger.info('Finding user profile with id %s', req.params.id);

  req.model('UserProfile').findById(req.params.id)
    .lean()
    .exec((err, userProfile) => {
      if (err) { return next(err); }
      if (!userProfile) { return res.status(404).end(); }

      req.logger.verbose('Sending user profile to client');
      res.sendFound(userProfile);
    });
}

function getCurrentUserProfile(req, res, next) {
  return res.sendFound(req.user);
}

function updateUserProfileById(req, res, next) {
  req.logger.info('Updating user profile with id %s', req.params.id);

  req.model('UserProfile').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('User profile not found');
      return res.status(404).end();
    }

    req.logger.verbose('Profile updated');
    res.status(204).end();
  });
}


router.get('/:id([0-9a-f]{24})', findUserProfileById);
router.get('/', jwt.auth, jwt.session, getCurrentUserProfile);
router.put('/:id([0-9a-f]{24})', updateUserProfileById);

module.exports = router;
