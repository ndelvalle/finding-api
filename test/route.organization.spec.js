/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const organization1Fixture = require('./fixture/organization/organization-1');
const organization2Fixture = require('./fixture/organization/organization-2');

const newOrganization1Fixture = require('./fixture/organization/new-organization-1');
const newOrganization2Fixture = require('./fixture/organization/new-organization-2');

const updateOrganization1Fixture = require('./fixture/organization/update-organization-1');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('Organization Routes', () => {

  before(done => api.start(done));
  beforeEach(() => connection.db.collection('organizations').remove({}));
  after(done => api.stop(done));

  describe('Create Organization Route - POST /', () => {

    it('creates a new organization document in the database and responds 201 status code', (cb) => {
      request.post('/organization', { json: newOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 201);

        connection.db.collection('organizations').find({}).toArray((err, organizations) => {
          if (err) { return cb(err); }

          assert.equal(organizations.length, 1);

          const organization = organizations[0];
          organization._id = organization._id.toString();
          assertContains(organization, newOrganization1Fixture);

          cb(null);
        });
      });
    });

    it('responds with a 400 error if the body of the request does not align with the organization schema', (cb) => {
      request.post('/organization', { json: {} }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));

        cb(null);
      });
    });
  });

  describe('Query Organization Route - GET /', () => {
    beforeEach(done => connection.db.collection('organizations')
      .insertMany([organization1Fixture, organization2Fixture], done));

    it('searches for organzation documents in the database and responds with 200 status code', (cb) => {
      request.get('/organization', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, [newOrganization1Fixture, newOrganization2Fixture]);

        cb(null);
      });
    });
  });

  describe('Get Organization Route - GET /:id', () => {
    beforeEach(done => connection.db.collection('organizations').insertOne(organization1Fixture, done));

    it('returns an organization document in the database and responds with 200 status code', (cb) => {
      request.get(`organization/${organization1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, newOrganization1Fixture);

        cb(null);
      });
    });

    it('responds with a 404 error if an organization does not exist with the given id', (cb) => {
      request.get(`organization/${organization2Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);

        cb(null);
      });
    });
  });

  describe('Update Organization by Id Route - PUT /:id', () => {
    beforeEach(done => connection.db.collection('organizations').insertOne(organization1Fixture, done));

    it('updates an organization document and responds with a 204 status code', (cb) => {
      request.put(`organization/${organization1Fixture._id.toString()}`,
      { json: updateOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('organizations').findOne({ _id: organization1Fixture._id }, (err, organization) => {
          if (err) { return cb(err); }

          assertContains(organization, { description: 'Something...' });

          cb(null);
        });
      });
    });

    it('responds with a 404 error if an organization does not exist with the given id', (cb) => {
      request.put('organization/5d9e362ece1cf00fa05efb96', { json: updateOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.put('organization/0', { json: updateOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });
  });

  describe('Remove Organization Route - DELETE /:id', () => {
    beforeEach(done => connection.db.collection('organizations').insertOne(organization1Fixture, done));

    it('removes a organization document from the database and responds with 204 status code', (cb) => {
      request.delete(`organization/${organization1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('organizations').findOne({ _id: organization1Fixture._id }, (err, organization) => {
          if (err) { return cb(err); }

          assert.ok(organization.removedAt instanceof Date);
          cb(null);
        });
      });
    });

    it('responds with a 404 error if an organization does not exist with the given id', (cb) => {
      request.delete('organization/5d9e362ece1cf00fa05efb96', { json: updateOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.delete('organization/0', { json: updateOrganization1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });

  });

  describe('Restore Organization Route - POST /restore/:id', () => {
    beforeEach(done => {
      connection.db.collection('organizations').insertOne(
        Object.assign({}, organization1Fixture, { removedAt: new Date() }),
        done
      );
    });

    it('restores a organization document in the database and responds with 204 status code', (cb) => {
      request.post(`organization/restore/${organization1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('organizations').findOne({ _id: organization1Fixture._id }, (err, organization) => {
          if (err) { return cb(err); }

          assert.ok(!organization.removedAt);

          cb(null);
        });
      });
    });
  });
});
