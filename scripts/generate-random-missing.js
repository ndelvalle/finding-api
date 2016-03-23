'use strict';

var config = require('../config/config');

var mongoose = require('mongoose');
var Promise  = require('bluebird');
var Faker    = require('Faker');

var Missing = require('../models/missing-model');

Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);

// amount of random data to generate
var AMOUNT = 20;

function generateGeo() {
  return {
    loc: [ -110.8571443, 32.4586858 ],
    name: 'AlleyNYC',
    line1: '500 7th Ave',
    line2: 'Floor 17A',
    neighborhood: 'Midtown',
    sublocality: 'Manhattan',
    city: 'New York',
    postalCode: '10018',
    stateCode: 'NY',
    state: 'New York',
    countryCode: 'US',
    country: 'United States',
    timezone: 'America/New_York'
  };
}

function generatePerson(geo) {
  return {
    name: {
      first: Faker.Name.firstName(),
      last: Faker.Name.lastName()
    },
    age: Math.floor(Math.random() * (80 - 18 + 1) + 18),
    gender: ['M', 'F'][Math.floor(Math.random() * ['M', 'F'].length)],
    geo: geo
  };
}

function generateMissing() {
  var geo = generateGeo();
  var person = generatePerson(geo);
  
  return Missing.create({
    person: person,
    lastSeen: new Date(),
    photos: [{
      url: Faker.Image.avatar()
    }, {
      url: Faker.Image.avatar()
    }],
    description: {
      clothing: Faker.Lorem.sentence(),
      appearance: Faker.Lorem.sentence(),
      relevantData: Faker.Lorem.sentence()
    }
  });
}

var promiseQueue = [];
for (var i = 0; i < AMOUNT; i++) {
  promiseQueue.push(generateMissing());
}

Promise.all(promiseQueue)
  .then(function(ppl) {
    console.log(ppl.length + ' people has been created');
    process.exit();
  })
  .catch(function(err) {
    console.log(err);
    process.exit(1);
  });
