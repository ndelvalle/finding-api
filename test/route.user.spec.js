/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config.js');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const newUser1Fixture    = require('./fixture/user/new-user-1.js');
const user1Fixture       = require('./fixture/user/user-1.js');
const updateUser1Fixture = require('./fixture/user/update-user-1.js');

const api        = require('../');
const connection = api.database.mongoose.connection;

request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('User Routes', () => {

  before((cb) => api.start(cb));
  beforeEach((cb) => connection.db.collection('users').remove({}, cb));
  after((cb) => api.stop(cb));


  describe('Create User Route - POST /', () => {
    it('creates a user document in the database', (cb) => {
      request.post('/user', { json: newUser1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }
        connection.db.collection('users').find({}).toArray((err, users) => {
          if (err) { return cb(err); }

          assert.equal(users.length, 1);

          const user = users[0];
          assert.equal(newUser1Fixture.username, user.username);
          assert.notEqual(newUser1Fixture.password, user.password);

          cb(null);
        });
      });
    });

    it('responds with the newly created user document and a 201 status code', (cb) => {
      request.post('/user', { json: newUser1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 201);
        assertContains(clientRes.body, Object.assign({}, newUser1Fixture, { password: undefined }));
        cb(null);
      });
    });

    it('responds with a 400 error if the body of the request does not align with the user schema', (cb) => {
      request.post('/user', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });

  describe('Query User Route - GET /', () => {
    beforeEach( (cb) => connection.db.collection('users').insertOne(user1Fixture, cb));

    it('searches for users documents in the database', (cb) => {
      request.get('/user', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assertContains(clientRes.body, [
          Object.assign({}, newUser1Fixture, { password: undefined })
        ]);

        cb(null);
      });
    });
  });

  describe('Get User Route - GET /:id', () => {
    beforeEach( (cb) => connection.db.collection('users').insertOne(user1Fixture, cb));

    it('retrieves a user document in the database', (cb) => {
      request.get(`user/${user1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assertContains(clientRes.body, Object.assign({}, newUser1Fixture, { password: undefined }));

        cb(null);
      });
    });
  });

  describe('Update User by Id Route - PUT /:id', () => {
    it('updates a document by id and responds with a 204', (cb) => {
      connection.db.collection('users').insertOne(user1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`user/${user1Fixture._id.toString()}`, { json: updateUser1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('users').findOne({ _id: user1Fixture._id }, (err, user) => {
            if (err) { return cb(err); }

            assertContains(user, Object.assign({}, updateUser1Fixture, { password: undefined }));

            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
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
    beforeEach( (cb) => connection.db.collection('users').insertOne(user1Fixture, cb));

    it('removes a user document from the database', (cb) => {
      request.delete(`user/${user1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('users').findOne({ _id: user1Fixture._id }, (err, user) => {
          if (err) { return cb(err); }

          assert.ok(user.removedAt instanceof Date);
          cb(null);
        });
      });
    });
  });

  describe('Restore User Route - POST /restore/:id', () => {
    beforeEach( (cb) => {
      connection.db.collection('users').insertOne(
        Object.assign({}, user1Fixture, { removedAt: new Date() }),
        cb
      );
    });

    it('restores a user document in the database', (cb) => {
      request.post(`user/restore/${user1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('users').findOne({ _id: user1Fixture._id }, (err, user) => {
          if (err) { return cb(err); }

          assert.ok(!user.removedAt);

          cb(null);
        });
      });
    });
  });
});
