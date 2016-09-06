/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const organization1Fixture       = require('./fixture/organization/organization-1');
const newOrganization1Fixture    = require('./fixture/organization/new-organization-1');
const updateOrganization1Fixture = require('./fixture/organization/update-organization-1');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('Organization Routes', () => {

  before(done => api.start(done));

  beforeEach(() => connection.db.collection('organizations').remove({}));

  after(done => api.stop(done));

  describe('Create Organization Route - POST /', () => {
    it.only('creates a new organization document in the database and responds 201 status code', (cb) => {
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


      request.post('/organization', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });

  describe.skip('Query People Route - GET /', () => {
    beforeEach((cb) => connection.db.collection('organizations').insertOne(organization1Fixture, cb));

    it('searches for people documents in the database', (cb) => {
      request.get('/organization', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(organization => {
          organization.lastSeenAt  = new Date(organization.lastSeenAt);
          organization.isBrowsable = true;
          return organization;
        });

        assertContains(clientRes.body, [newOrganization1Fixture]);

        cb(null);
      });
    });
  });

  describe.skip('Query People by geolocation Route - GET /', () => {
    beforeEach((cb) => connection.db.collection('organizations').insertOne(organization1Fixture, cb));

    it('searches for people documents by geolocation in the database', (cb) => {
      const longitude = newOrganization1Fixture.geo.loc[0];
      const latitude  = newOrganization1Fixture.geo.loc[1];
      request.get(`/organization/near/${longitude}/${latitude}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(organization => {
          organization.lastSeenAt  = new Date(organization.lastSeenAt);
          organization.isBrowsable = true;
          return organization;
        });

        assertContains(clientRes.body, [newOrganization1Fixture]);

        cb(null);
      });
    });

    it('searches for people documents by geolocation using 1km radius in the database', (cb) => {
      const longitude = -58.371692;
      const latitude  = -34.654220;

      request.get(`/organization/near/${longitude}/${latitude}`, {
        qs: { radius: 1 }, json: true
      }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assert.deepEqual(clientRes.body, []);

        cb(null);
      });
    });

    it('searches for people documents by geolocation using 10km radius in the database', (cb) => {
      const longitude = -58.371692;
      const latitude  = -34.654220;

      request.get(`/organization/near/${longitude}/${latitude}`, {
        qs: { radius: 10 }, json: true
      }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(organization => {
          organization.lastSeenAt  = new Date(organization.lastSeenAt);
          organization.isBrowsable = true;
          return organization;
        });

        assertContains(clientRes.body, [newOrganization1Fixture]);

        cb(null);
      });
    });
  });

  describe('Get Organization Route - GET /:id', () => {
    beforeEach( (cb) => connection.db.collection('organizations').insertOne(organization1Fixture, cb));

    it.skip('retrieves a organization document in the database', (cb) => {
      request.get(`organization/${organization1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt  = new Date(clientRes.body.lastSeenAt);
        clientRes.body.isBrowsable = true;

        assertContains(clientRes.body, newOrganization1Fixture);

        cb(null);
      });
    });
  });

  describe('Update Organization by Id Route - PUT /:id', () => {
    it.skip('updates a document by id and responds with a 204', (cb) => {
      connection.db.collection('organizations').insertOne(organization1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`organization/${organization1Fixture._id.toString()}`, { json: updateOrganization1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('organizations').findOne({ _id: organization1Fixture._id }, (err, organization) => {
            if (err) { return cb(err); }

            assertContains(organization, updateOrganization1Fixture);

            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      connection.db.collection('organizations').insertOne(organization1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put('organization/5d9e362ece1cf00fa05efb96', { json: updateOrganization1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 404);
          cb(null);
        });
      });
    });
  });

  describe.skip('Remove Organization Route - DELETE /:id', () => {
    beforeEach( (cb) => connection.db.collection('organizations').insertOne(organization1Fixture, cb));

    it('removes a organization document from the database', (cb) => {
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
  });

  describe('Restore Organization Route - POST /restore/:id', () => {
    beforeEach( (cb) => {
      connection.db.collection('organizations').insertOne(
        Object.assign({}, organization1Fixture, { removedAt: new Date() }),
        cb
      );
    });

    it.skip('restores a organization document in the database', (cb) => {
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
