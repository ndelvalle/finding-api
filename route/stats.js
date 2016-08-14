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
    $match : { removeAt : undefined }
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
    $match : { removeAt : undefined }
  }])
    .exec((err, ageStats) => {
      if (err) { return next(err); }
      if (!ageStats) { return res.status(404).end(); }

      req.logger.verbose('Sending age stats to client');
      res.sendFound(ageStats);
    });
}

router.get('/person/gender', getStatsByGender);
router.get('/person/age',    getStatsByAge);


module.exports = router;
