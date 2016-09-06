/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let request  = require('request');
const assert = require('assert');

const userProfileFixture1 = require('./fixture/user-profile/user-profile-1');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('User Profile Routes', () => {

  before(done => api.start(done));
  beforeEach(() => connection.db.collection('userprofiles').remove({}));
  after(done => api.stop(done));

  describe('Get UserProfile Route - GET /:id', () => {
    beforeEach(done => connection.db.collection('userprofiles').insertOne(userProfileFixture1, done));

    it('returns an user profile document in the database and responds with 200 status code', (cb) => {
      request.get(`user-profile/${userProfileFixture1._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);

        cb(null);
      });
    });

    it('responds with a 404 error if an user profile does not exist with the given id', (cb) => {
      request.get('user-profile/579817307de07f755e40ef11', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);

        cb(null);
      });
    });
  });

});
