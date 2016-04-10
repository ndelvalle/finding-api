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

MissingSchema.virtual('person.name.full')
.get(() => {
  const first = this.name.first || '';
  const last = this.name.last || '';
  return `${first} ${last}`.trim();
});

MissingSchema.pre('save', next => {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

export default mongoose.model('Missing', MissingSchema);
