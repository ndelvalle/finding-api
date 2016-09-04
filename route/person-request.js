const Router = require('express').Router;
const router = new Router();


function createPersonRequest(req, res, next) {
  req.logger.info('Creating personRequest', req.body);
  req.model('PersonRequest').create(req.body, (err, personRequest) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending personRequest to client');
    res.sendCreated(personRequest);
  });
}

function queryPersonRequests(req, res, next) {
  req.logger.info('Querying personRequests', req.query);
  req.model('PersonRequest').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, personRequests, personRequestCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending personRequest to client');
      res.sendQueried(personRequests, personRequestCount);
    });
}

function findPersonRequestById(req, res, next) {
  req.logger.info('Finding personRequest with id %s', req.params.id);
  req.model('PersonRequest').findById(req.params.id)
    .lean()
    .exec((err, personRequest) => {
      if (err) { return next(err); }
      if (!personRequest) { return res.status(404).end(); }

      req.logger.verbose('Sending personRequest to client');
      res.sendFound(personRequest);
    });
}

function updatePersonRequestById(req, res, next) {
  req.logger.info('Updating personRequest with id %s', req.params.id);
  req.model('PersonRequest').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('PersonRequest not found');
      return res.status(404).end();
    }
    req.logger.verbose('PersonRequest updated');
    res.status(204).end();
  });
}

function removePersonRequestById(req, res, next) {
  req.logger.info('Removing personRequest with id %s', req.params.id);
  req.model('PersonRequest').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('PersonRequest not found');
      return res.status(404).end();
    }
    req.logger.verbose('PersonRequest removed');
    res.status(204).end();
  });
}

function restorePersonRequestById(req, res, next) {
  req.logger.info('Restoring personRequest with id %s', req.params.id);
  req.model('PersonRequest').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('PersonRequest not found');
      return res.status(404).end();
    }
    req.logger.verbose('PersonRequest restored');
    res.status(204).end();
  });
}

router.post(  '/',                  createPersonRequest);
router.get(   '/',                  queryPersonRequests);
router.get(   '/:id([0-9a-f]{24})', findPersonRequestById);
router.put(   '/:id',               updatePersonRequestById);
router.delete('/:id',               removePersonRequestById);
router.post(  '/restore/:id',       restorePersonRequestById);


module.exports = router;
