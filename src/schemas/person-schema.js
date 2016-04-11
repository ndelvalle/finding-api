import GeoSchema from './geo-schema';

export default {

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

  geo: GeoSchema,

};
