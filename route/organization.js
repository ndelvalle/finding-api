const Router = require('express').Router;
const router = new Router();


function createOrganization(req, res, next) {
  req.logger.info('Creating organization', req.body);

  req.model('Organization').create(req.body, (err, organization) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending organization to client');
    res.sendCreated(organization);
  });
}

function queryOrganization(req, res, next) {
  req.logger.info('Querying organizations', req.query);

  req.model('Organization').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, organization, organizationCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending organizations to client');
      res.sendQueried(organization, organizationCount);
    });
}

function findOrganizationById(req, res, next) {
  req.logger.info(`Finding organization with id ${req.params.id}`);

  req.model('Organization').findById(req.params.id)
    .lean()
    .exec((err, organization) => {
      if (err) { return next(err); }
      if (!organization) { return res.status(404).end(); }

      req.logger.verbose('Sending organization to client');
      res.sendFound(organization);
    });
}

function updateOrganizationById(req, res, next) {
  req.logger.info(`Updating organization with id ${req.params.id}`);

  req.model('Organization').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('Organization not found');
      return res.status(404).end();
    }

    req.logger.verbose('Organization updated');
    res.status(204).end();
  });
}

function removeOrganizationById(req, res, next) {
  req.logger.info(`Removing organization with id ${req.params.id}`);

  req.model('Organization').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Organization not found');
      return res.status(404).end();
    }
    req.logger.verbose('Organization removed');
    res.status(204).end();
  });
}

function restoreOrganizationById(req, res, next) {
  req.logger.info(`Restoring organization with id ${req.params.id}`);

  req.model('Organization').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Organization not found');
      return res.status(404).end();
    }
    req.logger.verbose('Organization restored');
    res.status(204).end();
  });
}

router.post(  '/',                  createOrganization);
router.get(   '/',                  queryOrganization);
router.get(   '/:id([0-9a-f]{24})', findOrganizationById);
router.put(   '/:id',               updateOrganizationById);
router.delete('/:id',               removeOrganizationById);
router.post(  '/restore/:id',       restoreOrganizationById);


module.exports = router;
