const Schema = require('mongoose').Schema

const actions = ['GET', 'POST', 'PUT', 'DELETE', '*']
const models = ['User', 'Organization', 'Permission', 'Person', 'Role', '*']

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  action: { type: String, enum: actions },
  model: { type: String, enum: models }
})

module.exports = permissionSchema
