import { genSaltAsync, hashAsync } from 'bcrypt';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

});

UserSchema.pre('save', next => {
  if (!this.isModified('password')) { return next(); }

  // generate a salt
  return genSaltAsync(SALT_WORK_FACTOR)
  // hash the password along with the new salt
  .then(salt => hashAsync(this.password, salt))
  .then(hash => {
    // override the cleartext password with the hashed one
    this.password = hash;
    next();
  })
  .catch(err => next(err));
});

export default mongoose.model('User', UserSchema);
