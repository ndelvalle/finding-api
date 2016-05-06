export default {

  loc: {
    type: [Number],    // [<longitude>, <latitude>]
    index: '2dsphere', // create the geospatial index
    required: true,
  },

  address: {
    type: String,
    trim: true,
  },

  neighborhood: {
    type: String,
  },

  region: {
    type: String,
  },

  city: {
    type: String,
    required: true,
  },

  postalCode: {
    type: String,
  },

  countryCode: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

};
