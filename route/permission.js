const Router = require('express').Router;
const router = new Router();


function createPermission(req, res, next) {
  req.logger.info('Creating permission', req.body);

  req.model('Permission').create(req.body, (err, permission) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending permission to client');
    res.sendCreated(permission);
  });
}

function queryPermission(req, res, next) {
  // req.logger.info('Querying permissions', req.query);

  req.model('Permission').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, permission, permissionCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending permissions to client');
      res.sendQueried(permission, permissionCount);
    });
}

function findPermissionById(req, res, next) {
  req.logger.info(`Finding permission with id ${req.params.id}`);

  req.model('Permission').findById(req.params.id)
    .lean()
    .exec((err, permission) => {
      if (err) { return next(err); }
      if (!permission) { return res.status(404).end(); }

      req.logger.verbose('Sending permission to client');
      res.sendFound(permission);
    });
}

function updatePermissionById(req, res, next) {
  req.logger.info(`Updating permission with id ${req.params.id}`);

  req.model('Permission').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('Permission not found');
      return res.status(404).end();
    }

    req.logger.verbose('Permission updated');
    res.status(204).end();
  });
}

function removePermissionById(req, res, next) {
  req.logger.info(`Removing permission with id ${req.params.id}`);

  req.model('Permission').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Permission not found');
      return res.status(404).end();
    }
    req.logger.verbose('Permission removed');
    res.status(204).end();
  });
}

function restorePermissionById(req, res, next) {
  req.logger.info(`Restoring permission with id ${req.params.id}`);

  req.model('Permission').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Permission not found');
      return res.status(404).end();
    }
    req.logger.verbose('Permission restored');
    res.status(204).end();
  });
}

router.post(  '/',                  createPermission);
router.get(   '/',                  queryPermission);
router.get(   '/:id([0-9a-f]{24})', findPermissionById);
router.put(   '/:id',               updatePermissionById);
router.delete('/:id',               removePermissionById);
router.post(  '/restore/:id',       restorePermissionById);


module.exports = router;
