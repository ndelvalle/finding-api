const Router = require('express').Router;
const router = new Router();


function createUser(req, res, next) {
  req.logger.info('Creating user', req.body);
  req.model('User').create(req.body, (err, user) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending user to client');
    res.sendCreated(user);
  });
}

function queryUsers(req, res, next) {
  req.logger.info('Querying users', req.query);
  req.model('User').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, users, userCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending user to client');
      res.sendQueried(users, userCount);
    });
}

function findUserById(req, res, next) {
  req.logger.info('Finding user with id %s', req.params.id);
  req.model('User').findById(req.params.id)
    .lean()
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) { return res.status(404).end(); }

      req.logger.verbose('Sending user to client');
      res.sendFound(user);
    });
}

function updateUserById(req, res, next) {
  req.logger.info('Updating user with id %s', req.params.id);
  req.model('User').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('User not found');
      return res.status(404).end();
    }
    req.logger.verbose('User updated');
    res.status(204).end();
  });
}

function removeUserById(req, res, next) {
  req.logger.info('Removing user with id %s', req.params.id);
  req.model('User').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('User not found');
      return res.status(404).end();
    }
    req.logger.verbose('User removed');
    res.status(204).end();
  });
}

function restoreUserById(req, res, next) {
  req.logger.info('Restoring user with id %s', req.params.id);
  req.model('User').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('User not found');
      return res.status(404).end();
    }
    req.logger.verbose('User restored');
    res.status(204).end();
  });
}

router.post(  '/',                  createUser);
router.get(   '/',                  queryUsers);
router.get(   '/:id([0-9a-f]{24})', findUserById);
router.put(   '/:id',               updateUserById);
router.delete('/:id',               removeUserById);
router.post(  '/restore/:id',       restoreUserById);


module.exports = router;
