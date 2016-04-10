import config from '../config/config';
import { sign } from 'jsonwebtoken';

import Controller from '../libraries/controller';
import UserModel from '../models/user-model';

class UserController extends Controller {

  authenticate(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return next('Authentication failed. Username and password must be provided.');
    }

    return this.model.findOne({ username: { $regex: new RegExp(username, 'i') } })
    .then(user => {
      if (!user) {
        return Promise.reject('Authentication failed. Username and password do not match.');
      }
      this.user = user;
      return this.model.comparePassword(password, user.password);
    })
    .then(isCorrectPassword => {
      if (!isCorrectPassword) {
        return Promise.reject('Authentication failed. Username and password do not match.');
      }

      const token = sign(this.user, config.JWT.KEY, {
        expiresIn: config.JWT.EXPIRATION,
      });

      return res.status(200).json({ token });
    })
    .catch(err => res.status(401).send(err));
  }
}

export default new UserController(UserModel);
