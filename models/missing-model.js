'use strict';

var Model   = require('../libraries/model');
var Missing = require('../schemas/missing-schema');

var MissingModel = class extends Model {
  constructor(SchemaModel) {
    super(SchemaModel);
  }
};

module.exports = new MissingModel(Missing);
