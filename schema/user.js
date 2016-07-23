const bcrypt = require('bcrypt');
const Schema = require('mongoose').Schema;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isAdmin : { type: Boolean, default: false }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) { return next(); }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) { return next(err); }
    this.password = hash;
    next();
  });
});

module.exports = userSchema;
