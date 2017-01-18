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

function sendNotification(req, res, next) {
  req.logger.info('Sending a push notification');
  const headers =  {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZmUwMThmYS00MzM4LTRjZTEtOGI5Mi1kZTQxZDQzZjkwZDAifQ.83428txIeRM57XWVS99k8t1FFt5RRb7V9Cc3EDMocaQ',
    'Content-Type': 'application/json'
  };
  const notification = {
    tokens: ['97aca31fc30f456b9d0fa7db8a25ff907916eb5a7b37486e2efad0a18623cc17'],
    profile: 'test_app',
    notification: {
      message: 'Hola Mati! en Vicente Lopez se encuentran perdidos 20 personas! ayudanos a encontrarlos!'
    }
  };
  request.post('https://api.ionic.io/push/notifications', { headers, json: notification }, (err, clientRes, body) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.status(clientRes.statusCode).send(body).end();
    }
    req.logger.verbose('Sending push notification to device');
    res.status(200).send(body);
  });
}

router.get(  '/organization/:organizationId/notification-set',  getNotifications);
router.post( '/organization/:organizationId/notification-set',  createNotification);
router.post( '/organization/:organizationId/notification-push', sendNotification);

module.exports = router;
