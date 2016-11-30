const Router = require('express').Router;
const router = new Router();


// TODO: validate if role and/or organization exist and check if will be save id or name
// TODO: avoid lose data in update operation

function createUser(req, res, next) {
  req.logger.info('Creating user', req.body);

  if (!req.body.role) {
    return res.status(400).send('Missing role parameter.').end();
  }

  const userProfile = {
    role        : req.body.role,
    organization: req.body.organization
  };

  delete req.body.role;
  delete req.body.organization;

  req.auth0.management.users
    .create(req.body)
    .then((user) => {
      req.logger.verbose('Created user with id %s', user.userId);

      userProfile.auth0 = user.user_id;

      req.logger.info('Creating user profile', userProfile);
      req.model('UserProfile').create(userProfile, (err, userProfile) => {
        if (err) { return next(err); }

        user.profile = userProfile;

        req.logger.info('Sending user and user profile to client');
        return res.status(201).send(user);
      });
    })
    .catch(err => res.status(err.statusCode).send(err));
}

function queryUsers(req, res, next) {
  req.logger.info('Querying users', req.query);

  const params = {
    per_page: req.query.perPage ? parseInt(req.query.perPage, 10) : 50,
    page    : req.query.page    ? parseInt(req.query.page, 10)    : 0
  };

  if (req.query.q) {
    params.q = req.query.q;
    params.search_engine = 'v2';
  }

  req.auth0.management.users
    .getAll(params)
    .then((users) => {
      req.logger.verbose('Found %s users', users.length);
      return res.status(200).send(users);
    })
    .catch(err => res.status(err.statusCode).send(err));
}

function findUserById(req, res, next) {
  const id = req.params.id;
  req.logger.info('Finding user with id %s', id);

  req.auth0.management.users
    .get({ id })
    .then((user) => {
      req.logger.verbose('Found user with id %s', id);
      return res.status(200).send(user);
    })
    .catch(err => res.status(err.statusCode).send(err));
}

function updateUserById(req, res, next) {
  const id = req.params.id;
  req.logger.info('Updating user with id %s', id);

  const userProfile = {
    role         : req.body.role,
    organization : req.body.organization
  };

  delete req.body.role;
  delete req.body.organization;

  req.auth0.management.users
    .updateUserMetadata({ id }, req.body )
    .then((user) => {
      req.logger.verbose('Updated user with id %s', id);

      req.model('UserProfile').update({
        auth0: id
      }, userProfile, (err, results) => {
        if (err) { return next(err); }

        if (results.n < 1) {
          req.logger.verbose('UserProfile not found');
          return res.status(404).end();
        }

        req.logger.verbose('User and User profile updated');
        res.status(204).end();
      });
    })
    .catch(err => res.status(err.statusCode).send(err));
}

function removeUserById(req, res, next) {
  // TODO: check if is needed soft remove
  const id = req.params.id;
  req.logger.info('Removing user with id %s', req.params.id);

  req.auth0.management.users
    .delete({ id })
    .then((user) => {
      req.logger.verbose('Removed user with id %s', id);
      return res.status(204).send(user);
    })
    .catch(err => res.status(err.statusCode).send(err));
}

router.post(  '/',    createUser);
router.get(   '/',    queryUsers);
router.get(   '/:id', findUserById);
router.put(   '/:id', updateUserById);
router.delete('/:id', removeUserById);


module.exports = router;
