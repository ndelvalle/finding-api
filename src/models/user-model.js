import { compareAsync } from 'bcrypt';
import Model from '../libraries/model';
import User from '../schemas/user-schema';

class UserModel extends Model {
  comparePassword(password, hash) {
    return compareAsync(password, hash);
  }
}

export default new UserModel(User);
