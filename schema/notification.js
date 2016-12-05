const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const validators   = {
  location: {
    validator(v) { return v.length === 2; },
    message: '{VALUE} is not a valid location'
  }
};

const geo = {
  loc   : { type: [Number], index: '2dsphere', required: true, validate: validators.location },
  raduis: { type: Number }
};


const notificationSchema = new Schema({
  title    : { type : String, required: true },
  message  : { type : String },
  body     : { type : String },
  users    : [{ type: ObjectId }],
  createdBy: { type : String },
  status   : { type : Boolean },
  sentAt   : { type : Date },
  type     : { type : String, enum    : ['push', 'sms', 'email'] },
  organization: { type: ObjectId, required: true, ref: 'Organization', sparse: true },
  geo
});


module.exports = notificationSchema;
