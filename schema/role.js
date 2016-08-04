const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const roleSchema = new Schema({
  name       : { type: String, required: true, unique: true },
  description: { type: String },
  permissions: { type: ObjectId, ref: 'Permission' }
});


module.exports = roleSchema;
