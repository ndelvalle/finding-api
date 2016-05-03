import mongoose from 'mongoose';
import GeoSchema from './geo-schema';
import PhotoSchema from './photo-schema';
import ContactSchema from './contact-schema';

const Schema = mongoose.Schema;

const MissingSchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
    min: 0,
    max: 130,
  },

  gender: {
    type: String,
    enum: 'M F'.split(' '),
    required: true,
  },

  lastSeen: {
    type: Date,
  },

  isBrowsable: {
    type: Boolean,
    default: true,
    select: false,
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

  geo: GeoSchema,

  contact: ContactSchema,

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
