const personRequest1 = {
  name       : 'Foo Bar',
  age        : 24,
  gender     : 'M',
  lastSeenAt : new Date(),
  description: { clothing: 'Blue jeans', appearance: 'short beard' },
  contacts   : [{ name: 'John Doe', phone: '1234567', email: 'johndoe@email.com' }],
  geo: 'Bar'
};


module.exports = personRequest1;
