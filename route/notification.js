const Router  = require('express').Router;
const router  = new Router();
const request = require('request');


function queryNotificationSets(req, res, next) {
  req.logger.info('Querying NotificationSets', req.query);

  const notificationEnpoint = req.config.service.urls.NotificationD;
  request.get(`${notificationEnpoint}/organization/${req.params.organizationId}/notification-set`, (err, clientRes) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.sendStatus(clientRes.statusCode);
    }

    req.logger.verbose('Sending NotificationSets to client');
    res.status(200).send(clientRes.body);
  });
}

function createNotification(req, res, next) {
  req.logger.info('Creating a notification', req.body);

  const notificationEnpoint = req.config.service.urls.NotificationD;
  request.post(`${notificationEnpoint}/organization/${req.params.organizationId}/notification-set`, {
    json: req.body
  }, (err, clientRes) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.sendStatus(clientRes.statusCode);
    }

    req.logger.verbose('Sending created notification to client');
    res.status(200).send(clientRes.body);
  });
}

function sendNotification(req, res, next) {
  req.logger.info('Sending a push notification');
  const headers =  {
    Authorization: req.headers.authorization,
    'Content-Type': 'application/json'
  };
  // const notification = {
  //   tokens: ['97aca31fc30f456b9d0fa7db8a25ff907916eb5a7b37486e2efad0a18623cc17'],
  //   profile: 'test_app',
  //   notification: {
  //     message: 'Hola Mati! en V
  // icente Lopez se encuentran perdidos 20 personas! ayudanos a encontrarlos!'
  //   }
  // };
  // TODO REFACTOR THIS
  request.post('https://api.ionic.io/push/notifications', { headers, json: {} }, (err, clientRes, body) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.status(clientRes.statusCode).send(body).end();
    }
    req.logger.verbose('Sending push notification to device');
    res.status(200).send(body);
  });
}
router.post( '/organization/:organizationId/notification-set',  createNotification);
router.post( '/organization/:organizationId/notification-push', sendNotification);
router.get( '/organization/:organizationId/notification-set', queryNotificationSets);
router.post('/organization/:organizationId/notification-set', createNotification);
module.exports = router;
