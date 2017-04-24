const Router = require('express').Router
const router = new Router()

function createRole (req, res, next) {
  req.logger.info('Creating role', req.body)

  req.model('Role').create(req.body, (err, role) => {
    if (err) { return next(err) }

    req.logger.verbose('Sending role to client')
    res.sendCreated(role)
  })
}

function queryRole (req, res, next) {
  req.logger.info(`Querying roles ${JSON.stringify(req.query)}`)

  req.model('Role').countAndFind(req.query)
    .skip(req.skip)
    .limit(req.limit)
    .sort(req.sort)
    .lean()
    .exec((err, role, roleCount) => {
      if (err) { return next(err) }

      req.logger.verbose('Sending roles to client')
      res.sendQueried(role, roleCount)
    })
}

function findRoleById (req, res, next) {
  req.logger.info(`Finding role with id ${req.params.id}`)

  req.model('Role').findById(req.params.id)
    .lean()
    .exec((err, role) => {
      if (err) { return next(err) }
      if (!role) { return res.status(404).end() }

      req.logger.verbose('Sending role to client')
      res.sendFound(role)
    })
}

function updateRoleById (req, res, next) {
  req.logger.info(`Updating role with id ${req.params.id}`)

  req.model('Role').update({
    _id: req.params.id
  }, req.body, (err, results) => {
    if (err) { return next(err) }

    if (results.n < 1) {
      req.logger.verbose('Role not found')
      return res.status(404).end()
    }

    req.logger.verbose('Role updated')
    res.status(204).end()
  })
}

function removeRoleById (req, res, next) {
  req.logger.info(`Removing role with id ${req.params.id}`)

  req.model('Role').remove({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err) }

    if (results.nModified < 1) {
      req.logger.verbose('Role not found')
      return res.status(404).end()
    }
    req.logger.verbose('Role removed')
    res.status(204).end()
  })
}

function restoreRoleById (req, res, next) {
  req.logger.info(`Restoring role with id ${req.params.id}`)
  req.model('Role').restore({
    _id: req.params.id
  }, (err, results) => {
    if (err) { return next(err) }

    if (results.nModified < 1) {
      req.logger.verbose('Role not found')
      return res.status(404).end()
    }
    req.logger.verbose('Role restored')
    res.status(204).end()
  })
}

router.post('/', createRole)
router.get('/', queryRole)
router.get('/:id([0-9a-f]{24})', findRoleById)
router.put('/:id', updateRoleById)
router.delete('/:id', removeRoleById)
router.post('/restore/:id', restoreRoleById)

module.exports = router
