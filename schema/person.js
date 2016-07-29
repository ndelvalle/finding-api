const Schema      = require('mongoose').Schema;
const earthRadius = 6378.1;

const geo = {
  // [<longitude>, <latitude>]
  loc        : { type: [Number], index: '2dsphere', required: true },
  address    : { type: String, required: true },
  city       : { type: String, required: true },
  postalCode : { type: String },
  countryCode: { type: String, required: true },
  country    : { type: String, required: true }
};

const missingSchema = new Schema({
  name       : { type: String, required: true },
  age        : { type: Number, required: true, min: 0, max: 120 },
  gender     : { type: String, enum: 'M F'.split(' '), required: true },
  lastSeenAt : { type: Date },
  isBrowsable: { type: Boolean, default: true, select: false },
  isMissing  : { type: Boolean, default: true },
  photos     : [{ url: String, order: Number }],
  description: { clothing: String, appearance: String },
  contacts   : [{ name: String, phone: String, email: String }],
  geo
});

missingSchema.static('findByGeolocation', function(query, location, cb) {

  const radius    = Number(query.radius);
  const longitude = Number(location.lng);
  const latitude  = Number(location.lat);

  delete query.radius;

  const aggregationPipelines = [{
    $geoNear: {
      near              : [longitude, latitude],
      spherical         : true,
      distanceField     : 'distance',
      distanceMultiplier: earthRadius,
      maxDistance       : (radius || 5000) / earthRadius,
      query
    }
  }];

  if (query.skip) { aggregationPipelines.push({ $skip: query.skip }); }
  if (query.limit) { aggregationPipelines.push({ $limit: query.limit }); }

  this.aggregate(aggregationPipelines)
    .exec((err, people) => {
      if (err) { return cb(err); }

      cb(null, people);
    });
});

module.exports = missingSchema;
