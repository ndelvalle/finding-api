const Schema = require('mongoose').Schema

const contributorSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }
})

module.exports = contributorSchema
