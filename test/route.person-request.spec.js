/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let request          = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const newPersonRequest1Fixture    = require('./fixture/person-request/new-person-request-1');
const personRequest1Fixture       = require('./fixture/person-request/person-request-1');
const updatePersonRequest1Fixture = require('./fixture/person-request/update-person-request-1');

const api = require('../');
const connection = api.database.mongoose.connection;

request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('PersonRequest Routes', () => {

  before(done => api.start(done));
  beforeEach(done => { connection.db.collection('personrequests').remove({}, done); });
  after(done => api.stop(done));


  describe('Create PersonRequest Route - POST /person-request', () => {
    it('creates a personRequest document in the database', (cb) => {
      request.post('person-request', { json: newPersonRequest1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);

        connection.db.collection('personrequests').find({}).toArray((err, personRequests) => {
          if (err) { return cb(err); }

          assert.equal(personRequests.length, 1);

          const personRequest = personRequests[0];
          personRequest._id = personRequest._id.toString();
          assertContains(personRequest, newPersonRequest1Fixture);
          cb(null);
        });
      });
    });

    it('responds with the newly created account document and a 201 status code', (cb) => {
      request.post('person-request', { json: newPersonRequest1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);

        assert.equal(clientRes.statusCode, 201);
        assertContains(clientRes.body, newPersonRequest1Fixture);
        cb(null);
      });
    });

    it('responds with a 400 error if the body of the request does not align with the schema', (cb) => {
      request.post('person-request', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });

  describe('Query PersonRequest Route - GET /person-request', () => {
    beforeEach((cb) => connection.db.collection('personrequests').insertOne(personRequest1Fixture, cb));

    it('searches for a personRequest document by title in the database', (cb) => {
      request.get('/person-request', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body[0].lastSeenAt = new Date(clientRes.body[0].lastSeenAt);
        assertContains(clientRes.body, [newPersonRequest1Fixture]);
        cb(null);
      });
    });
  });

  describe('Get PersonRequest Route - GET /person-request/:id', () => {
    beforeEach( (cb) => connection.db.collection('personrequests').insertOne(personRequest1Fixture, cb));

    it('retrieves a personRequest document in the database', (cb) => {
      request.get(`person-request/${personRequest1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);
        assertContains(clientRes.body, newPersonRequest1Fixture);
        cb(null);
      });
    });
  });

  describe('Update PersonRequest by Id Route - PUT /person-request/:id', () => {
    it('updates a document by id and responds with a 204', (cb) => {
      connection.db.collection('personrequests').insertOne(personRequest1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`person-request/${personRequest1Fixture._id.toString()}`, { json: updatePersonRequest1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('personrequests').findOne({ _id: personRequest1Fixture._id }, (err, personRequest) => {
            if (err) { return cb(err); }

            assertContains(personRequest, { geo: 'Bar' } );
            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      connection.db.collection('personrequests').insertOne(personRequest1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put('person-request/5d9e362ece1cf00fa05efb96', { json: updatePersonRequest1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 404);
          cb(null);
        });
      });
    });
  });

  describe('Remove PersonRequest Route - DELETE /person-request/:id', () => {
    beforeEach( (cb) => connection.db.collection('personrequests').insertOne(personRequest1Fixture, cb));

    it('removes a personRequest document from the database', (cb) => {
      request.delete(`person-request/${personRequest1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('personrequests').findOne({ _id: personRequest1Fixture._id }, (err, personRequest) => {
          if (err) { return cb(err); }

          assert.ok(personRequest.removedAt instanceof Date);
          cb(null);
        });
      });
    });
  });

  describe('Restore PersonRequest Route - POST /person-request/restore/:id', () => {
    beforeEach( (cb) => {
      connection.db.collection('personrequests').insertOne(
        Object.assign({}, personRequest1Fixture, { removedAt: new Date() }),
        cb
      );
    });

    it('restores a personRequest document in the database', (cb) => {
      request.post(`person-request/restore/${personRequest1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);
        connection.db.collection('personrequests').findOne({ _id: personRequest1Fixture._id }, (err, personRequest) => {
          if (err) { return cb(err); }

          assert.ok(!personRequest.removedAt);

          cb(null);
        });
      });
    });
  });
});
