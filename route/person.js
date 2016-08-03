const Router = require('express').Router;
const jwt    = require('../lib/jwt');
const async  = require('async');
const router = new Router();


function createPerson(req, res, next) {
  req.logger.info('Creating person', req.body);
  req.model('Person').create(req.body, (err, person) => {
    if (err) { return next(err); }

    req.logger.verbose('Uploading person photos');
    async.map(req.body.photos, (item, cb) => {
      req.upload(item.data, person._id, item.order, cb);
    }, (err, urls) => {
      if (err) { return next(err); }

      person.photos = urls.map(x => {
        const mapped = { url: x.url, order: x.name };
        return mapped;
      });

      req.logger.verbose('Saving uploaded photos to person model');
      person.save((err, person) => {
        if (err) { return next(err); }

        req.logger.verbose('Sending person to client');
        res.sendCreated(person);
      });
    });
  });
}

function queryPeople(req, res, next) {
  req.logger.info('Querying people', req.query);
  req.model('Person').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, people, peopleCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending people to client');
      res.sendQueried(people, peopleCount);
    });
}

function queryPeopleByGeolocation(req, res, next) {
  req.logger.info('Querying people by geolocation', req.query);

  const location = { lng: req.params.longitude, lat: req.params.latitude };
  req.model('Person').findByGeolocation(req.query, location, (err, people) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending people to client');
    res.sendQueried(people);
  });
}

function findPersonById(req, res, next) {
  req.logger.info('Finding person with id %s', req.params.id);
  req.model('Person').findById(req.params.id)
    .lean()
    .exec((err, person) => {
      if (err) { return next(err); }
      if (!person) { return res.status(404).end(); }

      req.logger.verbose('Sending person to client');
      res.sendFound(person);
    });
}

function updatePersonById(req, res, next) {
  req.logger.info('Updating person with id %s', req.params.id);
  req.model('Person').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err); }

    if (results.n < 1) {
      req.logger.verbose('Person not found');
      return res.status(404).end();
    }
    req.logger.verbose('Person updated');
    res.status(204).end();
  });
}

function removePersonById(req, res, next) {
  req.logger.info('Removing person with id %s', req.params.id);
  req.model('Person').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Person not found');
      return res.status(404).end();
    }
    req.logger.verbose('Person removed');
    res.status(204).end();
  });
}

function restorePersonById(req, res, next) {
  req.logger.info('Restoring person with id %s', req.params.id);
  req.model('Person').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err); }

    if (results.nModified < 1) {
      req.logger.verbose('Person not found');
      return res.status(404).end();
    }
    req.logger.verbose('Person restored');
    res.status(204).end();
  });
}

router.post(  '/',                          jwt.auth, createPerson);
router.get(   '/',                          queryPeople);
router.get(   '/near/:longitude/:latitude', queryPeopleByGeolocation);
router.get(   '/:id([0-9a-f]{24})',         findPersonById);
router.put(   '/:id',                       jwt.auth, updatePersonById);
router.delete('/:id',                       jwt.auth, removePersonById);
router.post(  '/restore/:id',               jwt.auth, restorePersonById);


module.exports = router;
