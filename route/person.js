const async  = require('async');
const Router = require('express').Router;
const router = new Router();
const jwt    = require('../lib/jwt');


function createPerson(req, res, next) {
  const sendReponse = (req, res, person) => {
    req.logger.verbose('Sending person to client');
    res.sendCreated(person);
  };

  req.logger.info('Creating person', req.body);

  req.body.organization = req.user.organization;

  req.model('Person').create(req.body, (err, person) => {
    if (err) { return next(err); }

    if (!req.body.photos) { return sendReponse(req, res, person); }

    req.logger.verbose('Uploading person photos');

    async.map(req.body.photos, (item, cb) => {
      req.aws.upload(item.data, person._id, item.order, cb);
    }, (err, uploadedFiles) => {
      if (err) { return next(err); }

      person.photos = uploadedFiles.map((x, index) => {
        const mapped = { url: x.url, name: x.name, order: index };
        return mapped;
      });

      req.logger.verbose('Saving uploaded photos to person model');
      person.save((err, person) => {
        if (err) { return next(err); }
        sendReponse(req, res, person);
      });
    });
  });
}

function queryPerson(req, res, next) {
  req.logger.info('Querying persons', req.query);
  req.model('Person').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, persons, personsCount) => {
      if (err) { return next(err); }

      req.logger.verbose('Sending persons to client');
      res.sendQueried(persons, personsCount);
    });
}

function queryPersonByGeolocation(req, res, next) {
  req.logger.info('Querying persons by geolocation', req.query);

  const location = { lng: req.params.longitude, lat: req.params.latitude };
  req.model('Person').findNear(req.query, location, (err, people) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending persons to client');
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
    _id        : req.params.id,
    organizaton: req.user.organizaton
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
    organizaton: req.user.organizaton
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

router.get(   '/',                          queryPerson);
router.get(   '/near/:longitude/:latitude', queryPersonByGeolocation);
router.get(   '/:id([0-9a-f]{24})',         findPersonById);

router.post(  '/',            jwt.auth, jwt.session, createPerson);
router.put(   '/:id',         jwt.auth, jwt.session, updatePersonById);
router.delete('/:id',         jwt.auth, jwt.session, removePersonById);
router.post(  '/restore/:id', jwt.auth, jwt.session, restorePersonById);


module.exports = router;
