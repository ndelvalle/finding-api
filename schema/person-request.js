const Schema = require('mongoose').Schema;
const validators   = {
  location: {
    validator(v) { return v.length === 2; },
    message: '{VALUE} is not a valid location'
  }
};

const geo = {
  loc        : { type: [Number], index: '2dsphere', required: true, validate: validators.location },
  address    : { type: String, required: true },
  city       : { type: String, required: true },
  countryCode: { type: String, required: true },
  country    : { type: String, required: true },
  postalCode : { type: String }
};

const personRequestSchema = new Schema({
  name       : { type: String, required: true },
  age        : { type: Number, required: true, min: 0, max: 120 },
  gender     : { type: String, required: true, enum: 'M F'.split(' ') },
  description: { clothing: String, appearance: String, disappearance: String },
  contacts   : [{ name: String, phone: String, email: String }],
  lastSeenAt : { type: Date },
  approved   : { type: Boolean, default: false },
  geo
});


module.exports = personRequestSchema;
