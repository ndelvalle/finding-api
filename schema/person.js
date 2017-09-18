const mongooseSlugs = require('mongoose-document-slugs')
const Schema = require('mongoose').Schema
const ObjectId = Schema.Types.ObjectId

const EARTH_RADIUS = 6378.1

const validators = {
  location: {
    validator (v) { return v.length === 2 },
    message: '{VALUE} is not a valid location'
  }
}

const geo = {
  loc: { type: [Number], index: '2dsphere', required: true, validate: validators.location },
  address: { type: String, required: true },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  country: { type: String, required: true },
  vicinity: { type: String },
  postalCode: { type: String }
}

const personSchema = new Schema({
  name: { type: String, required: true },
  organization: { type: ObjectId, required: true, ref: 'Organization', sparse: true },
  age: { type: Number, required: true, min: 0, max: 120 },
  gender: { type: String, required: true, enum: ['M', 'F'] },
  isBrowsable: { type: Boolean, default: true, select: false },
  description: { clothing: String, appearance: String, more: String },
  contacts: [{ name: String, phone: String, email: String }],
  photos: [{ url: String, name: String, order: Number }],
  lastSeenAt: { type: Date },
  foundAt: { type: Date },
  geo
})

personSchema.plugin(mongooseSlugs)

personSchema.virtual('isFound').get(function () {
  return this.foundAt !== undefined
}).set(function (val) {
  this.foundAt = val ? new Date() : undefined
})

personSchema.set('toJSON', { virtuals: true })
personSchema.set('toObject', { virtuals: true })

personSchema.static('findNear', function (query, pagination, location, cb) {
  const aggregationPipelines = []

  const radius = Number(query.radius)
  const longitude = Number(location.lng)
  const latitude = Number(location.lat)
  const project = [
    'name', 'slug', 'age', 'gender', 'description', 'photos', 'lastSeenAt', 'geo', 'distance'
  ]

  delete query.radius

  query.foundAt = { $exists: false }

  aggregationPipelines.push({
    $geoNear: {
      near: [longitude, latitude],
      spherical: true,
      distanceField: 'distance',
      distanceMultiplier: EARTH_RADIUS,
      maxDistance: (radius || 5000) / EARTH_RADIUS,
      query
    }
  })

  if (pagination.skip) { aggregationPipelines.push({ $skip: pagination.skip }) }
  if (pagination.limit) { aggregationPipelines.push({ $limit: pagination.limit }) }
  aggregationPipelines.push({ $project: project.reduce((t, c) => {
    t[c] = 1
    return t
  }, {}) })

  this.aggregate(aggregationPipelines).exec(cb)
})

module.exports = personSchema
