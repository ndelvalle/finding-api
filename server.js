
'use strict';

var config = require('./config/config');
var port   = config.PORT;

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var mongoose   = require('mongoose');

var routes      = require('./routes');
var middlewares = require('./middlewares');

var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(middlewares.cors);

app.use(morgan('tiny'));

app.use('/', routes);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
