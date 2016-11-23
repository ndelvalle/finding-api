/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const role1Fixture = require('./fixture/role/role-1');
const role2Fixture = require('./fixture/role/role-2');

const newRole1Fixture = require('./fixture/role/new-role-1');
const newRole2Fixture = require('./fixture/role/new-role-2');

const updateRole1Fixture = require('./fixture/role/update-role-1');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('Role Routes', () => {

  before(done => api.start(done));
  beforeEach(() => connection.db.collection('roles').remove({}));
  after(done => api.stop(done));

  describe('Create Role Route - POST /', () => {

    it('creates a new role document in the database and responds 201 status code', (cb) => {
      request.post('/role', { json: newRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 201);

        connection.db.collection('roles').find({}).toArray((err, roles) => {
          if (err) { return cb(err); }

          assert.equal(roles.length, 1);

          const role = roles[0];
          role._id = role._id.toString();
          assertContains(role, newRole1Fixture);

          cb(null);
        });
      });
    });

    it('responds with a 400 error if the body of the request does not align with the role schema', (cb) => {
      request.post('/role', { json: {} }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));

        cb(null);
      });
    });
  });

  describe('Query Role Route - GET /', () => {
    beforeEach(done => connection.db.collection('roles')
      .insertMany([role1Fixture, role2Fixture], done));

    it('searches for role documents in the database and responds with 200 status code', (cb) => {
      request.get('/role', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, [newRole1Fixture, newRole2Fixture]);

        cb(null);
      });
    });
  });

  describe('Get Role Route - GET /:id', () => {
    beforeEach(done => connection.db.collection('roles').insertOne(role1Fixture, done));

    it('returns an role document in the database and responds with 200 status code', (cb) => {
      request.get(`role/${role1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, newRole1Fixture);

        cb(null);
      });
    });

    it('responds with a 404 error if an role does not exist with the given id', (cb) => {
      request.get(`role/${role2Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);

        cb(null);
      });
    });
  });

  describe('Update Role by Id Route - PUT /:id', () => {
    beforeEach(done => connection.db.collection('roles').insertOne(role1Fixture, done));

    it('updates an role document and responds with a 204 status code', (cb) => {
      request.put(`role/${role1Fixture._id.toString()}`,
      { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('roles').findOne({ _id: role1Fixture._id }, (err, role) => {
          if (err) { return cb(err); }

          assertContains(role, { description: 'Chuck Norris' });

          cb(null);
        });
      });
    });

    it('responds with a 404 error if an role does not exist with the given id', (cb) => {
      request.put('role/5d9e362ece1cf00fa05efb96', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.put('role/0', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });
  });

  describe('Remove Role Route - DELETE /:id', () => {
    beforeEach(done => connection.db.collection('roles').insertOne(role1Fixture, done));

    it('removes a role document from the database and responds with 204 status code', (cb) => {
      request.delete(`role/${role1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('roles').findOne({ _id: role1Fixture._id }, (err, role) => {
          if (err) { return cb(err); }

          assert.ok(role.removedAt instanceof Date);
          cb(null);
        });
      });
    });

    it('responds with a 404 error if an role does not exist with the given id', (cb) => {
      request.delete('role/5d9e362ece1cf00fa05efb96', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.delete('role/0', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });

  });

  describe('Restore Role Route - POST /restore/:id', () => {
    beforeEach((done) => {
      connection.db.collection('roles').insertOne(
        Object.assign({}, role1Fixture, { removedAt: new Date() }),
        done
      );
    });

    it('restores a role document in the database and responds with 204 status code', (cb) => {
      request.post(`role/restore/${role1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('roles').findOne({ _id: role1Fixture._id }, (err, role) => {
          if (err) { return cb(err); }

          assert.ok(!role.removedAt);

          cb(null);
        });
      });
    });

    it('responds with a 404 error if an role does not exist with the given id', (cb) => {
      request.post('role/restore/5d9e362ece1cf00fa05efb96', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.post('role/restore/0', { json: updateRole1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });
  });
});
