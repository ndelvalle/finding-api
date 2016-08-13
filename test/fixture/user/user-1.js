const ObjectId = require('mongodb').ObjectId;

const user1 = {
  email        : 'test@keepe.rs',
  role         : new ObjectId('579817307de07f755e40ef4d'),
  emailVerified: false,
  user_id       : 'auth0|579817307de07f755e40ef4d',
  nickname     : null,
  identities   : [{
    connection : 'Username-Password-Authentication',
    userId     : '579817307de07f755e40ef4d',
    provider   : 'auth0',
    isSocial   : false
  }]
};

module.exports = user1;
