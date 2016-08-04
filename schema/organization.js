const Schema = require('mongoose').Schema;

const organizationSchema = new Schema({
  name       : { type: String, required: true, unique: true },
  description: { type: String }
});


module.exports = organizationSchema;
