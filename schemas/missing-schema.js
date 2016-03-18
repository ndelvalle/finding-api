'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PersonSchema = require('./person-schema');

var MissingSchema = new Schema({

person: PersonSchema,

lastSeen: {
  type: Date
},

isBrowsable: {
  type: Boolean,
  default: true
},

isMissing: {
  type: Boolean,
  default: true
},

photos: [{
  url: {
    type: String
  }
}],

description: {

  clothing: {
    type: String
  },

  appearance: {
    type: String
  },

  relevantData: {
    type: String
  }

}

});

module.exports = mongoose.model('Missing', MissingSchema);
