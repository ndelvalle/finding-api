'use strict';

var Controller = require('../libraries/controller');
var MissingModel = require('../models/missing-model');

var MissingController = class extends Controller {
  constructor(Model) {
    super(Model);
  }
};

module.exports = new MissingController(MissingModel);
