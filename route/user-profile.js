const Router = require('express').Router;
const router = new Router();

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

router.get('/:id([0-9a-f]{24})', findUserProfileById);


module.exports = router;
