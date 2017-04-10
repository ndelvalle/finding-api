const async         = require('async');
const Router        = require('express').Router;
const authorization = require('../lib/authorization');
const router        = new Router();


function createPerson(req, res, next) {
  req.body.organization = req.user.user_metadata.organization;
  const body   = Object.assign({}, req.body, { photos: undefined });
  const photos = req.body.photos;

  req.logger.info('Creating person', body);
  req.model('Person').create(body, (err, person) => {
    if (err) { return next(err); }

    if (!req.body.photos || !req.body.photos.length) {
      req.logger.verbose('Sending person to client');
      return res.sendCreated(person);
    }

    req.logger.verbose('Uploading person photos');
    async.eachOf(photos, (value, index, cb) => {
      req.aws.upload(value.data, `/photos/${person._id}/${index}.png`, (err, url) => {
        value.url   = url;
        value.order = index;
        cb(null);
      });
    }, (err) => {
      if (err) { return next(err); }
      person.photos = photos;

      req.logger.verbose('Saving uploaded photos to person model');
      person.save((err, person) => {
        if (err) { return next(err); }
        req.logger.verbose('Sending person to client');
        return res.sendCreated(person);
      });
    });
  });
}

function queryPerson(req, res, next) {
  // req.logger.info('Querying person', req.query);

  if (req.query && req.query.name) { req.query.name = new RegExp(req.query.name, 'i'); }
  req.model('Person').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, person, personCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending person to client');
      res.sendQueried(person, personCount);
    });
}

function queryPersonByGeolocation(req, res, next) {
  // req.logger.info('Querying person by geolocation', req.query);

  if (req.query && req.query.name) {
    req.query.name = new RegExp(req.query.name, 'i');
  }

  const location = {
    lng: req.params.longitude,
    lat: req.params.latitude
  };

  req.model('Person').findNear(req.query, {
    skip : req.skip,
    limit: req.limit
  }, location, (err, persons) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending person to client');
    res.sendQueried(persons, persons.length);
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

function getPersonsByOrganization(req, res, next) {
  // req.logger.info('Querying persons by organization');
  req.query = { organization: req.params.organizationId };
  queryPerson(req, res, next);
}

function updatePersonById(req, res, next) {
  req.logger.info('Updating person with id %s', req.params.id);

  req.model('Person').update({
    _id         : req.params.id,
    organization: req.user.user_metadata.organization
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
  req.model('Person').findById(req.params.id, (err, person) => {
    if (err) { return next(err); }

    if (!person) {
      req.logger.verbose('Person not found');
      return res.status(404).end();
    }

    person.remove((err, person) => {
      if (err) { return next(err); }

      req.aws.remove(req.params.id, person.photos);
      req.logger.verbose('Person removed');
      res.status(204).end();
    });
  });
}

function restorePersonById(req, res, next) {
  req.logger.info('Restoring person with id %s', req.params.id);
  req.model('Person').restore({
    _id        : req.params.id,
    organizaton: req.user.user_metadata.organization
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

router.get('/',                                           queryPerson);
router.get('/near/:longitude/:latitude',                  queryPersonByGeolocation);
router.get('/:id([0-9a-f]{24})',                          findPersonById);
router.get('/organization/:organizationId([0-9a-f]{24})', getPersonsByOrganization);

router.post(  '/',            authorization, createPerson);
router.put(   '/:id',         authorization, updatePersonById);
router.delete('/:id',         authorization, removePersonById);
router.post(  '/restore/:id', authorization, restorePersonById);


module.exports = router;
