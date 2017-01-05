const Schema   = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;

const EARTH_RADIUS = 6378.1;

const validators   = {
  location: {
    validator(v) { return v.length === 2; },
    message: '{VALUE} is not a valid location'
  }
};

const geo = {
  loc        : { type: [Number], index: '2dsphere', required: true, validate: validators.location },
  address    : { type: String, required: true },
  city       : { type: String, required: true },
  countryCode: { type: String, required: true },
  country    : { type: String, required: true },
  postalCode : { type: String }
};

const personSchema = new Schema({
  name        : { type: String, required: true },
  organization: { type: ObjectId, required: true, ref: 'Organization', sparse: true },
  age         : { type: Number, required: true, min: 0, max: 120 },
  gender      : { type: String, required: true, enum: 'M F'.split(' ') },
  isBrowsable : { type: Boolean, default: true, select: false },
  isMissing   : { type: Boolean, default: true },
  description : { clothing: String, appearance: String, disappearance: String, relevantData: String },
  contacts    : [{ name: String, phone: String, email: String }],
  photos      : [{ url: String, order: Number }],
  lastSeenAt  : { type: Date },
  foundAt     : { type: Date },
  geo
});

personSchema.static('findNear', function(query, pagination, location, cb) {
  const aggregationPipelines = [];

  const radius = Number(query.radius);
  delete query.radius;

  const longitude = Number(location.lng);
  const latitude  = Number(location.lat);

  query.isMissing = query.isMissing === 'true';

  // due of soft remove mongoose plugin
  query.removedAt = undefined;

  aggregationPipelines.push({
    $geoNear: {
      near              : [longitude, latitude],
      spherical         : true,
      distanceField     : 'distance',
      distanceMultiplier: EARTH_RADIUS,
      maxDistance       : (radius || 5000) / EARTH_RADIUS,
      query
    }
  });

  if (pagination.skip)  { aggregationPipelines.push({ $skip : pagination.skip }); }
  if (pagination.limit) { aggregationPipelines.push({ $limit: pagination.limit }); }

  this.aggregate(aggregationPipelines)
    .exec((err, person) => {
      if (err) { return cb(err); }

      cb(null, person);
    });
});

module.exports = personSchema;
