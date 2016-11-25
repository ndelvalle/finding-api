const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const roleSchema = new Schema({
  auth0       : { type: String,   required: true, unique: true },
  role        : { type: ObjectId, required: true, ref: 'Role' },
  organization: { type: ObjectId, ref: 'Role' },
  firstName   : { type: String },
  lastName    : { type: String },
  avatarUrl   : { type: String },
  metadata    : { type: Object }
});


module.exports = roleSchema;
