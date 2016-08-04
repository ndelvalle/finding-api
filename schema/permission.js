const Schema = require('mongoose').Schema;

const permissionSchema = new Schema({
  name  : { type: String, required: true, unique: true },
  action: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', '*'] },
  model : { type: String, enum: ['User', 'Organization', 'Permission', 'Person', 'Role', '*'] }
});


module.exports = permissionSchema;
