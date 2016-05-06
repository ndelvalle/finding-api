import config from '../config/config';
import Missing from '../models/missing-model';

import mongoose from 'mongoose';
import Promise from 'bluebird';
import Faker from 'Faker';

Promise.promisifyAll(mongoose);
mongoose.connect(config.MONGODB_URL);

// amount of random data to generate
const AMOUNT = 20;

function generateGeo() {
  return {
    loc: [-58.5168854, -34.5340785],
    address: 'Maquinista Carregal 1980',
    neighborhood: 'Florida',
    sublocality: 'Vicente Lopez',
    city: 'Buenos Aires',
    postalCode: '1602',
    stateCode: 'BSAS',
    state: 'Buenos Aires',
    countryCode: 'AR',
    country: 'Argentina',
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
