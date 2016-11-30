/* eslint-disable max-len */
/* global describe it before after beforeEach */

// TODO: refactor mocks and add test cases for wrong paths

require('./config');
require('./mock/jwt');

let request  = require('request');
const assert = require('assert');
const sinon  = require('sinon');

const newUser1Fixture     = require('./fixture/user/new-user-1');
const user1Fixture        = require('./fixture/user/user-1');
const updateUser1Fixture  = require('./fixture/user/update-user-1');
const userProfile1Fixture = require('./fixture/user-profile/user-profile-1');

const api        = require('../');
const connection = api.database.mongoose.connection;
const users      = api.server.expressApp.request.auth0.management.users;

request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('User Routes', () => {

  before(done => api.start(done));
  beforeEach(() => connection.db.collection('userprofiles').remove({}));
  after(done => api.stop(done));


  describe('Create User Route - POST /', () => {
    it('creates a new user in Auth0 and responds with 201 status code', (cb) => {
      sinon.stub(users, 'create', () => Promise.resolve(user1Fixture));

      request.post('/user', { json: newUser1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }
        const user = clientRes.body;

        assert.equal(clientRes.statusCode, 201);
        assert.equal(user.email, newUser1Fixture.email);
        assert.equal(user.password, undefined);

        users.create.restore();
        cb(null);
      });
    });

    it.skip('responds with a 400 error if the body of the request does not align with auth0 parameters', (cb) => {
      sinon.stub(users, 'create', () => { throw new Error({ statusCode: 900, name: 'something' }); });

      request.post('/user', { json: newUser1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        users.create.restore();
        cb(null);
      });
    });
  });

  describe('Query User Route - GET /', () => {
    it('searches for users in Auth0 in the database and responds with a 200 status code', (cb) => {
      sinon.stub(users, 'getAll', () => Promise.resolve([user1Fixture]));

      request.get('/user', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        const user = clientRes.body[0];

        assert.equal(clientRes.statusCode, 200);
        assert.equal(user.email, newUser1Fixture.email);
        assert.equal(user.password, undefined);

        users.getAll.restore();
        cb(null);
      });
    });
  });

  describe('Get User Route - GET /:id', () => {
    it('retrieves a user from Auth0 in the database and responds with a 200 status code', (cb) => {
      sinon.stub(users, 'get', () => Promise.resolve(user1Fixture));

      request.get(`user/${user1Fixture.userId}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assert.equal(clientRes.body.email, newUser1Fixture.email);
        assert.equal(clientRes.body.password, undefined);

        users.get.restore();
        cb(null);
      });
    });
  });

  describe('Update User by Id Route - PUT /:id', () => {
    it('updates a user from Auth0 by id and responds with a 204 status code', (cb) => {
      sinon.stub(users, 'updateUserMetadata', () => Promise.resolve(user1Fixture));
      connection.db.collection('userprofiles').insertOne(userProfile1Fixture, (err) => {
        if (err) { return cb(err); }
        request.put(`user/${user1Fixture.userId}`, { json: updateUser1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }
          assert.equal(clientRes.statusCode, 204);
          users.updateUserMetadata.restore();
          cb(null);
        });
      });
    });

    it.skip('responds with a 404 error if a document does not exist with the given id', (cb) => {
      connection.db.collection('users').insertOne(user1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put('user/5d9e362ece1cf00fa05efb96', { json: updateUser1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 404);
          cb(null);
        });
      });
    });
  });

  describe('Remove User Route - DELETE /:id', () => {
    sinon.stub(users, 'delete', () => Promise.resolve(user1Fixture));

    it('removes a user document from the database and responds with a 204 status code', (cb) => {
      request.delete(`user/${user1Fixture.userId}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        users.delete.restore();
        cb(null);
      });
    });
  });

});
