const pkg = require('../package')
const Router = require('express').Router
const router = new Router()

function getRoot (req, res, next) {
  req.logger.verbose('Responding to root request')
  req.logger.verbose('Sending response to client')

  res.send({
    name: pkg.name,
    version: pkg.version,
    env: process.env.NODE_ENV
  })
}

function getStatus (req, res, next) {
  req.logger.verbose('Responding to status request')
  req.logger.verbose('Sending response to client')

  req.pingDatabase((err, result) => {
    if (err) { return next(err) }
    if (!result || !result.ok) { return res.status(503).end() }

    res.status(204).end()
  })
}

router.get('/', getRoot)
router.get('/status', getStatus)

module.exports = router
