const config     = require('../config');
const expressJWT = require('express-jwt');

const jwtMiddleware = {};

// TODO: Temporal fix until find a better solution :)
if (config.env !== 'UT') {
  jwtMiddleware.auth = expressJWT({
    secret  : Buffer.from(config.auth0.clientSecret, 'base64'),
    audience: config.auth0.clientID
  })
  .unless({ path: ['/', '/status', '/auth'] });

  jwtMiddleware.session = (req, res, next) => {
    if (!req.user) { return req.status(401).end(); }

    req.model('UserProfile').findOne({ auth0: req.user.sub }, (err, userProfile) => {
      if (err) { return next(err); }

      req.user = Object.assign(userProfile, req.user);
      next();
    });
  };

} else {
  jwtMiddleware.auth    = (req, res, next) => next(null);
  jwtMiddleware.session = (req, res, next) => next(null);
}


module.exports = jwtMiddleware;
