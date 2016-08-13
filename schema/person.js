const Schema   = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const EARTH_RADIUS = 6378.1;

const geo = {
  // [<longitude>, <latitude>]
  loc        : { type: [Number], index: '2dsphere', required: true },
  address    : { type: String, required: true },
  city       : { type: String, required: true },
  countryCode: { type: String, required: true },
  country    : { type: String, required: true },
  postalCode : { type: String }
};

const personSchema = new Schema({
  name        : { type: String,   required: true },
  organization: { type: ObjectId, required: true, ref: 'Organization', sparse: true },
  age         : { type: Number,   required: true, min: 0, max: 120 },
  gender      : { type: String,   required: true, enum: 'M F'.split(' ') },
  isBrowsable : { type: Boolean, default: true, select: false },
  isMissing   : { type: Boolean, default: true },
  description : { clothing: String, appearance: String },
  contacts    : [{ name: String, phone: String, email: String }],
  photos      : [{ url: String, order: Number }],
  lastSeenAt  : { type: Date },
  geo
});

personSchema.static('findNear', function(query, location, cb) {

  const radius    = Number(query.radius);
  const longitude = Number(location.lng);
  const latitude  = Number(location.lat);

  delete query.radius;

  const aggregationPipelines = [{
    $geoNear: {
      near              : [longitude, latitude],
      spherical         : true,
      distanceField     : 'distance',
      distanceMultiplier: EARTH_RADIUS,
      maxDistance       : (radius || 5000) / EARTH_RADIUS,
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

module.exports = personSchema;
