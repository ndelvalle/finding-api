'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = require('./person-schema');
var PhotoSchema  = require('./photo-schema');

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

  photos: [PhotoSchema],

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

  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

MissingSchema.virtual('person.name.full').get(function() {
  var first = this.name.first || '';
  var last = this.name.last || '';

  return (first + ' ' + last).trim();
});

MissingSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Missing', MissingSchema);
