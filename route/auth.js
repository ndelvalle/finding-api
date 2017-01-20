const Router   = require('express').Router;
const router   = new Router();
const request  = require('request');
const jwt = require('../lib/jwt');


function checkType(req, res, next) {
  const headers =  {
    Authorization: req.headers.authorization,
    'Content-Type': 'application/json'
  };
  request.get(`https://keepers-co.auth0.com/api/v2/users/${req.user.sub}`, { headers }, (err, clientRes, body) => {
    if (err) { return next(err); }
    const userData = JSON.parse(body);
    if (userData.user_metadata.types.indexOf('cms') > -1) {
      res.status(200).end();
    }
    res.status(403).end('You are not allow to log in the cms');
  });
}

function authenticate(req, res, next) {
  req.logger.verbose('Authenticating user through Auth0');

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Missing username and/or password parameters.').end();
  }

  const auth0     = req.config.auth0;
  const auth0Body = {
    username,
    password,
    client_id : auth0.clientID,
    connection: auth0.connections.db,
    scope     : auth0.scope
  };
  request.post(auth0.authURL, { json: auth0Body }, (err, clientRes, body) => {
    if (err) { return next(err); }
    if (clientRes.statusCode !== 200) {
      return res.status(clientRes.statusCode).send(body).end();
    }
    req.logger.verbose('Sending user token to client');
    res.status(200).send(body);
  });
}

function auth0Callback(req, res, next) {
  if (!req.user) {
    throw new Error('User could not be authenticated');
  }

  // TODO: Check what should be send as response.
  res.json(req.user);
}

function auth0FailedCallback(req, res, next) {
  if (!req.user) {
    throw new Error('User could not be authenticated');
  }

  // TODO: Check what should be send as response.
  res.json(req.user);
}


router.post('/',            authenticate);
router.get( '/db-callback', auth0Callback);
router.get( '/db-fail',     auth0FailedCallback);
router.get( '/:id/type', jwt.auth, jwt.session,  checkType);


module.exports = router;
