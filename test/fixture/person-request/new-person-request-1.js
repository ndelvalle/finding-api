
const newPersonRequest1 = {
  name       : 'Foo Bar',
  age        : 24,
  gender     : 'M',
  lastSeenAt : new Date(),
  description: { clothing: 'Blue jeans', appearance: 'long beard' },
  contacts   : [{ name: 'John Doe', phone: '1234567', email: 'johndoe@email.com' }],
  geo: {
    loc: [
      -58.381276,
      -34.604703
    ],
    address: 'Av. 9 de Julio 1000',
    city: 'Ciudad Autónoma de Buenos Aires',
    postalCode: '1043',
    countryCode: 'AR',
    country: 'Argentina'
  }
};


module.exports = newPersonRequest1;
