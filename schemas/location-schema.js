var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LocationSchema = new Schema({
    name: String,
    loc: {
      type: [Number],    // [<longitude>, <latitude>]
      index: '2dsphere'  // geospatial index
    }
});

module.exports = mongoose.model('Geo', LocationSchema);
