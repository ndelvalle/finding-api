
'use strict';

var config = require('./config/config');
var port   = config.PORT;

var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var helmet     = require('helmet');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var Promise    = require('bluebird');

var routes      = require('./routes');
var middlewares = require('./middlewares');

Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(middlewares.cors);
app.use('/', routes);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
