const Router = require('express').Router;
const router = new Router();


function getStatsByGender(req, res, next) {
  req.logger.verbose('Responding to gender statistics request');
  req.model('Person').aggregate([{
    $project: {
      male  : { $cond: [{ $eq: ['$gender', 'M'] }, 1, 0] },
      female: { $cond: [{ $eq: ['$gender', 'F'] }, 1, 0] }
    }
  }, {
    $group: {
      _id: null,
      male  : { $sum: '$male' },
      female: { $sum: '$female' },
      total : { $sum: 1 }
    }
  }, {
    $match : { removeAt: undefined }
  }])
    .exec((err, genderStats) => {
      if (err) { return next(err); }
      if (!genderStats) { return res.status(404).end(); }

      req.logger.verbose('Sending gender stats to client');
      res.sendFound(genderStats);
    });
}

function getStatsByAge(req, res, next) {
  req.logger.verbose('Responding to age statistics request');
  req.model('Person').aggregate([{
    $group: {
      _id  : '$age',
      total: { $sum: 1 }
    }
  }, {
    $match : { removeAt: undefined }
  }])
    .exec((err, ageStats) => {
      if (err) { return next(err); }
      if (!ageStats) { return res.status(404).end(); }

      req.logger.verbose('Sending age stats to client');
      res.sendFound(ageStats);
    });
}

function getPersonTotalCount(req, res, next) {
  req.logger.verbose('Responding to person count request');
  req.model('Person').count({ removeAt: undefined }, (err, count) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending person count to client');
    res.sendFound(count);
  });
}

function getPersonChildrenCount(req, res, next) {
  req.logger.verbose('Responding to person children count request');
  req.model('Person').count({
    removeAt: undefined,
    age: { $lt: 18 }
  }, (err, count) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending person children count to client');
    res.sendFound(count);
  });
}

function getPersonFoundCount(req, res, next) {
  req.logger.verbose('Responding to person found count request');
  req.model('Person').count({
    removeAt : undefined,
    isMissing: false
  }, (err, count) => {
    if (err) { return next(err); }

    req.logger.verbose('Sending person found count to client');
    res.sendFound(count);
  });
}

router.get('/person/gender',         getStatsByGender);
router.get('/person/age',            getStatsByAge);
router.get('/person/count/total',    getPersonTotalCount);
router.get('/person/count/children', getPersonChildrenCount);
router.get('/person/count/found',    getPersonFoundCount);


module.exports = router;
