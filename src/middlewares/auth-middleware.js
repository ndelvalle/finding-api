import config from '../config/config';
import { verifyAsync } from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No token provided.',
    });
  }

  return verifyAsync(token, config.JWT.KEY)
  .then(decoded => {
    req.decoded = decoded; // eslint-disable-line no-param-reassign
    next();
  })
  .catch(err => next(err));
};
