'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = mongoose.Schema({

  url: {
    type: String
  }

},{ _id : false });

module.exports = PhotoSchema;
