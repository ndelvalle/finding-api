const Router = require('express').Router
const router = new Router()
const request = require('request')

function queryNotificationSets (req, res, next) {
  req.logger.info(`Querying notifications ${JSON.stringify(req.query)}`)

  const notificationEnpoint = req.config.service.urls.NotificationD
  request.get(`${notificationEnpoint}/organization/${req.params.organizationId}/notification-set`, (err, clientRes) => {
    if (err) { return next(err) }
    if (clientRes.statusCode !== 200) {
      return res.sendStatus(clientRes.statusCode)
    }

    req.logger.verbose('Sending NotificationSets to client')
    res.status(200).send(clientRes.body)
  })
}

function createNotification (req, res, next) {
  req.logger.info('Creating a notification', req.body)

  const notificationEnpoint = req.config.service.urls.NotificationD
  request.post(`${notificationEnpoint}/organization/${req.params.organizationId}/notification-set`, {
    json: req.body
  }, (err, clientRes) => {
    if (err) { return next(err) }
    if (clientRes.statusCode !== 200) {
      return res.sendStatus(clientRes.statusCode)
    }

    req.logger.verbose('Sending created notification to client')
    res.status(200).send(clientRes.body)
  })
}

router.get('/organization/:organizationId/notification-set', queryNotificationSets)
router.post('/organization/:organizationId/notification-set', createNotification)

module.exports = router
