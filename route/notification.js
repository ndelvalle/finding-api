const Router = require('express').Router;
const router = new Router();
const request  = require('request');


function getNotifications(req, res, next) {
  req.logger.info('Querying notifications', req.query);

  request.get(`${req.config.notificationsApi.url}bundle/`, (err, clientRes, body) => {
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

  const notification = req.body;

  req.auth0.management.users.getAll()
  .then((users) => {
    notification.users = users.map( a => a.user_id );
    return notification;
  })
  .then((notification) => {
    request.post(`${req.config.notificationsApi.url}bundle/`,
      { json: notification }, (err, clientRes, body) => {
        if (err) { return next(err); }
        if (clientRes.statusCode !== 200) {
          return res.status(clientRes.statusCode).send(body).end();
        }

        req.logger.verbose('Sending created notification to client');

        res.status(200).send(body);
      });
  });
}

router.get(  '/notification-set', getNotifications);
router.post( '/',                 createNotification);

module.exports = router;
