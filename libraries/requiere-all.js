'use strict';

var fs = require('fs');
var _  = require('lodash');

module.exports = function (path, options) {
  options = options || {};
  var modules = {};
  var files = fs.readdirSync(path);

  files.forEach(function (file) {
    if (/\.js$/.test(file) && file !== 'index.js') {
      var name = file;

      if (options.stripFromName) {
        name = name.replace(options.stripFromName, '');
      }

      name = _.camelCase(name.replace(/\.js/, ''));

      modules[name] = require(path + '/' + file);
    }
  });

  return modules;
};
