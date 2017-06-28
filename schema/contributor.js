const Schema = require('mongoose').Schema

const contributorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
})

module.exports = contributorSchema
