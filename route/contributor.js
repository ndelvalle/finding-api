const Router = require('express').Router
const router = new Router()

function createContributor (req, res, next) {
  req.logger.info('Creating contributor', req.body)

  req.model('Contributor').create(req.body, (err, contributor) => {
    if (err) { return next(err) }

    req.logger.verbose('Sending contributor to client')
    res.sendCreated(contributor)
  })
}

function queryContributor (req, res, next) {
  req.logger.info('Querying contributors', req.query)

  req.model('Contributor').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, contributor, contributorCount) => {
      if (err) { return next(err) }

      req.logger.verbose('Sending contributors to client')
      res.sendQueried(contributor, contributorCount)
    })
}

function findContributorById (req, res, next) {
  req.logger.info(`Finding contributor with id ${req.params.id}`)

  req.model('Contributor').findById(req.params.id)
    .lean()
    .exec((err, contributor) => {
      if (err) { return next(err) }
      if (!contributor) { return res.status(404).end() }

      req.logger.verbose('Sending contributor to client')
      res.sendFound(contributor)
    })
}

function updateContributorById (req, res, next) {
  req.logger.info(`Updating contributor with id ${req.params.id}`)

  req.model('Contributor').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err) }

    if (results.n < 1) {
      req.logger.verbose('Contributor not found')
      return res.status(404).end()
    }

    req.logger.verbose('Contributor updated')
    res.status(204).end()
  })
}

function removeContributorById (req, res, next) {
  req.logger.info(`Removing contributor with id ${req.params.id}`)

  req.model('Contributor').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err) }

    if (results.nModified < 1) {
      req.logger.verbose('Contributor not found')
      return res.status(404).end()
    }
    req.logger.verbose('Contributor removed')
    res.status(204).end()
  })
}

router.post('/', createContributor)
router.get('/', queryContributor)
router.get('/:id([0-9a-f]{24})', findContributorById)
router.put('/:id', updateContributorById)
router.delete('/:id', removeContributorById)

module.exports = router
