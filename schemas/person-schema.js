'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LocationSchema = require('./location-schema');

var PersonSchema = new Schema({

  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },

  age: {
    type: Number,
    required: true,
    min: 0,
    max: 130
  },

  gender: {
    type: String,
    enum: 'M F'.split(' '),
    required: true
  },

  location: LocationSchema,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }


});

PersonSchema.pre('save', function(next){
  var now = new Date();
  this.updatedAt = now;
  if(!this.createdAt) {
      this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Person', PersonSchema);
