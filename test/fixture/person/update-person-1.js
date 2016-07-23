const ObjectId = require('mongodb').ObjectId;

const person1 = {
  _id        : new ObjectId('12a3d077c143c921072e342a'),
  name       : 'Nicolas Del Valle',
  age        : 24,
  gender     : 'M',
  lastSeenAt : new Date(),
  isBrowsable: true,
  isMissing  : true,
  description: { clothing: 'Blue jeans and back t shirt', appearance: 'short beard' },
  contacts   : [{ name: 'John Doe', phone: '7654321', email: 'johndoe@email.com' }],
  photos     : [
    { order: 0, url: 'http://www.casinoefbet.com/wp-content/uploads/2015/02/bill-gates-wealthiest-person.jpg' },
    { order: 1, url: 'http://www.casinoefbet.com/wp-content/uploads/2015/02/bill-gates-wealthiest-person.jpg' }
  ],
  geo: {
    loc        : [-58.381276, -34.604703],
    address    : 'Av. 9 de Julio 1000',
    city       : 'Ciudad Autónoma de Buenos Aires',
    postalCode : '1043',
    countryCode: 'AR',
    country    : 'Argentina'
  }
};


module.exports = person1;
