import config from '../config/config';
import Missing from '../models/missing-model';

import mongoose from 'mongoose';
import Promise from 'bluebird';
import Faker from 'Faker';

Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);
// mongoose.connect('mongodb://heroku_q0jc3w1d:np4n527c13jdsqd1g2qmnuncfl@ds011439.mlab.com:11439/heroku_q0jc3w1d');

// amount of random data to generate
const AMOUNT = 20;

function generateGeo() {
  return {
    loc: [-110.8571443, 32.4586858],
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
    timezone: 'America/New_York',
  };
}

function generateMissing() {
  const geo = generateGeo();
  return Missing.create({
    name: `${Faker.Name.firstName()} ${Faker.Name.lastName()}`,
    age: Math.floor(Math.random() * (80 - 18 + 1) + 18),
    gender: ['M', 'F'][Math.floor(Math.random() * ['M', 'F'].length)],
    geo,
    lastSeen: new Date(),
    photos: [{
      url: Faker.Image.avatar(),
    }, {
      url: Faker.Image.avatar(),
    }],
    description: {
      clothing: Faker.Lorem.sentence(),
      appearance: Faker.Lorem.sentence(),
      relevantData: Faker.Lorem.sentence(),
    },
  });
}

const promiseQueue = [];
for (let i = 0; i < AMOUNT; i++) {
  promiseQueue.push(generateMissing());
}

Promise.all(promiseQueue)
.then(ppl => {
  console.log(`${ppl.length} people has been created`); // eslint-disable-line no-console
  process.exit();
})
.catch(err => {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});
