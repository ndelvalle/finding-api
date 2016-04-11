import mongoose from 'mongoose';

const Schema = mongoose.Schema;

import PersonSchema from './person-schema';
import PhotoSchema from './photo-schema';

const MissingSchema = new Schema({

  person: PersonSchema,

  lastSeen: {
    type: Date,
  },

  isBrowsable: {
    type: Boolean,
    default: true,
  },

  isMissing: {
    type: Boolean,
    default: true,
  },

  photos: [PhotoSchema],

  description: {

    clothing: {
      type: String,
    },

    appearance: {
      type: String,
    },

    relevantData: {
      type: String,
    },

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

MissingSchema
// @TODO: can't get to work this with arrow function
.pre('save', function (next) {  // eslint-disable-line func-names
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

export default mongoose.model('Missing', MissingSchema);
