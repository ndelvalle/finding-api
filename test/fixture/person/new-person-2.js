const newPerson2 = {
  _id: '57ca56f35a6fe8ba8baf03cd',
  organization: '57ad47e540ae419411780bbf',
  name: 'Brian Stanley',
  age: 20,
  gender: 'M',
  lastSeenAt: new Date(),
  isBrowsable: true,
  isMissing: true,
  description: { clothing: 'Read shirt', appearance: 'Nice guy' },
  contacts: [{ name: 'John Doe', phone: '1234567', email: 'johndoe@email.com' }],
  photos: [
    { order: 0, url: 'http://www.casinoefbet.com/wp-content/uploads/2015/02/bill-gates-wealthiest-person.jpg' },
    { order: 1, url: 'http://www.casinoefbet.com/wp-content/uploads/2015/02/bill-gates-wealthiest-person.jpg' }
  ],
  geo: {
    loc: [-58.381276, -34.604703],
    address: 'Migueletes 800',
    city: 'Corrientes',
    postalCode: '1429',
    countryCode: 'AR',
    country: 'Argentina'
  }
}

module.exports = newPerson2
