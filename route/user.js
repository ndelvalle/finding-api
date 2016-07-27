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

  const params = {
    per_page: req.query.perPage ? parseInt(req.query.perPage, 10) : 50,
    page    : req.query.page ? parseInt(req.query.page, 10)       : 0
  };

  if (req.query.q) {
    params.q = req.query.q;
    params.search_engine = 'v2';
  }

  req.auth0.management.users
    .getAll(params)
    .then(users => {
      req.logger.verbose('Sending users to client');
      return res.status(200).send(users);
    })
    .catch(err => res.status(err.statusCode).send(err));
}

function findUserById(req, res, next) {
  const id = req.params.id;
  req.logger.info('Finding user with id %s', id);

  req.auth0.management.users
    .get({ id })
    .then(user => {
      req.logger.verbose('Sending user to client');
      return res.status(200).send(user);
    })
    .catch(err => res.status(err.statusCode).send(err));
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

router.post(  '/',            createUser);
router.get(   '/',            queryUsers);
router.get(   '/:id',         findUserById);
router.put(   '/:id',         updateUserById);
router.delete('/:id',         removeUserById);
router.post(  '/restore/:id', restoreUserById);


module.exports = router;
