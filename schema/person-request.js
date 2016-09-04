const Schema = require('mongoose').Schema;

const personRequestSchema = new Schema({
  name       : { type: String, required: true },
  age        : { type: Number, required: true, min: 0, max: 120 },
  gender     : { type: String, required: true, enum: 'M F'.split(' ') },
  description: { clothing: String, appearance: String },
  contacts   : [{ name: String, phone: String, email: String }],
  lastSeenAt : { type: Date },
  geo        : { type: String }
});


module.exports = personRequestSchema;
