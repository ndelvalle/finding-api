const Schema = require('mongoose').Schema;

const permissionSchema = new Schema({
  name  : { type: String, required: true, unique                                   : true },
  action: { type: String, enum    : ['GET', 'POST', 'PUT', 'DELETE', '*'], required: true },
  path  : { type: String }
});


module.exports = permissionSchema;
