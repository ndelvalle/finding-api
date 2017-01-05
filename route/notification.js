const Router = require('express').Router;
const router = new Router();
const request  = require('request');


function getNotifications(req, res, next) {
  req.logger.info('Querying notifications', req.query);
  request.get(`${req.config.notificationsApi.url}organization/${req.params.organizationId}/notification-set`, (err, clientRes, body) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.status(clientRes.statusCode).send(body).end();
    }

    req.logger.verbose('Sending notifications to user client');
    res.status(200).send(body);
  });
}

function createNotification(req, res, next) {
  req.logger.info('Creating a notification', req.body);
  const notification = {
    name       : req.body.name,
    title      : req.body.title,
    body       : req.body.body,
    type       : req.body.type,
    status     : req.body.status,
    sentAt     : req.body.sentAt,
    scheduledAt: req.body.scheduledAt,
    createdBy  : req.body.createdBy,
    geo        : req.body.geo
  };

  req.auth0.management.users.getAll()
  .then((users) => {
    notification.users = users.map( a => a.user_id );
    return notification;
  })
  .then((notification) => {
    request.post(`${req.config.notificationsApi.url}organization/${req.params.organizationId}/notification-set`, { json: notification }, (err, clientRes, body) => {
      if (err) { return next(err); }
      if (clientRes.statusCode !== 200) {
        return res.status(clientRes.statusCode).send(body).end();
      }
      req.logger.verbose('Sending created notification to client');

      res.status(200).send(body);
    });
  });
}

router.get('/organization/:organizationId/notification-set', getNotifications);
router.post(  '/organization/:organizationId/notification-set',    createNotification);

module.exports = router;
