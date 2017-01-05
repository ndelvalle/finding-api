const Schema = require('mongoose').Schema;

const organizationSchema = new Schema({
  name       : { type: String, required: true, unique: true },
  displayName: { type: String },
  description: { type: String },
  phones     : { type: [String] },
  email      : { type: [String] }
});

organizationSchema.pre('save', function(next) {
  this.displayName = this.get('displayName') || this.get('name');

  next();
});

module.exports = organizationSchema;
