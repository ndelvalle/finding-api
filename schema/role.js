const Schema = require('mongoose').Schema;

const roleSchema = new Schema({
  name       : { type: String, required: true, unique: true },
  description: { type: String }
});


module.exports = roleSchema;
