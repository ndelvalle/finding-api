'use strict';

exports = module.exports = {

  loc: {
    type: [Number],    // [<longitude>, <latitude>]
    index: '2dsphere', // create the geospatial index
    required: true
  },

  // Venue name: AlleyNYC
  name: {
    type: String,
    default: '',
    trim: true
  },

  // Street address: 500 7th Ave
  line1: {
    type: String,
    default: '',
    trim: true
  },

  // Suite/Apt/Floor/Unit: Floor 17A
  line2: {
    type: String,
    default: ''
  },

  // Friendly neighborhood name: Midtown
  neighborhood: {
    type: String,
    default: ''
  },

  // NY Borough: Manhattan
  sublocality: {
    type: String,
    default: ''
  },

  // City name: New York
  city: {
    type: String,
    required: true
  },

  // ZIP code: 10018
  postalCode: {
    type: String
  },

  // State code: NY
  stateCode: {
    type: String
  },

  // Full state name: New York
  state: {
    type: String
  },

  // Country code: US
  countryCode: {
    type: String,
    required: true
  },

  // Full state name: United States
  country: {
    type: String,
    required: true
  },

  // Olson time zone id: America/New_York
  timezone: {
    type: String,
    required: true
  }

};
