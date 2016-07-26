const jwt = require('../../lib/jwt');

jwt.auth = (req, res, next) => next(null);

module.exports = jwt;
