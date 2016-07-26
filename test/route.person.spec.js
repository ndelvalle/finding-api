/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config.js');
require('./mock/jwt.js');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const newPerson1Fixture    = require('./fixture/person/new-person-1.js');
const person1Fixture       = require('./fixture/person/person-1.js');
const updatePerson1Fixture = require('./fixture/person/update-person-1.js');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('Person Routes', () => {

  before((cb) => api.start(cb));
  beforeEach((cb) => connection.db.collection('people').remove({}, cb));
  after((cb) => api.stop(cb));

  describe('Create Person Route - POST /', () => {
    it.only('creates a person document in the database', (cb) => {
      request.post('/person', { json: newPerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        connection.db.collection('people').find({}).toArray((err, people) => {
          if (err) { return cb(err); }
          console.log(clientRes.body);

          assert.equal(people.length, 1);

          const person = people[0];

          clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);
          clientRes.body.createdAt  = new Date(clientRes.body.createdAt);
          clientRes.body.updatedAt  = new Date(clientRes.body.updatedAt);

          person._id = person._id.toString();

          person.contacts = person.contacts.map(contact => {
            contact._id = contact._id.toString();
            return contact;
          });

          person.photos = person.photos.map(photo => {
            photo._id = photo._id.toString();
            return photo;
          });

          assertContains(clientRes.body, Object.assign({}, person, { __v: undefined }));

          cb(null);
        });
      });
    });

    it('responds with the newly created person document and a 201 status code', (cb) => {
      request.post('/person', { json: newPerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);

        assert.equal(clientRes.statusCode, 201);
        assertContains(clientRes.body, Object.assign({}, newPerson1Fixture));
        cb(null);
      });
    });

    it('responds with a 400 error if the body of the request does not align with the person schema', (cb) => {
      request.post('/person', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });

  describe('Query People Route - GET /', () => {
    beforeEach((cb) => connection.db.collection('people').insertOne(person1Fixture, cb));

    it('searches for people documents in the database', (cb) => {
      request.get('/person', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(person => {
          person.lastSeenAt  = new Date(person.lastSeenAt);
          person.isBrowsable = true;
          return person;
        });

        assertContains(clientRes.body, [newPerson1Fixture]);

        cb(null);
      });
    });
  });

  describe('Query People by geolocation Route - GET /', () => {
    beforeEach((cb) => connection.db.collection('people').insertOne(person1Fixture, cb));

    it('searches for people documents by geolocation in the database', (cb) => {
      const longitude = newPerson1Fixture.geo.loc[0];
      const latitude  = newPerson1Fixture.geo.loc[1];
      request.get(`/person/near/${longitude}/${latitude}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(person => {
          person.lastSeenAt  = new Date(person.lastSeenAt);
          person.isBrowsable = true;
          return person;
        });

        assertContains(clientRes.body, [newPerson1Fixture]);

        cb(null);
      });
    });

    it('searches for people documents by geolocation using 1km radius in the database', (cb) => {
      const longitude = -58.371692;
      const latitude  = -34.654220;

      request.get(`/person/near/${longitude}/${latitude}`, {
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

      request.get(`/person/near/${longitude}/${latitude}`, {
        qs: { radius: 10 }, json: true
      }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(person => {
          person.lastSeenAt  = new Date(person.lastSeenAt);
          person.isBrowsable = true;
          return person;
        });

        assertContains(clientRes.body, [newPerson1Fixture]);

        cb(null);
      });
    });
  });

  describe('Get Person Route - GET /:id', () => {
    beforeEach( (cb) => connection.db.collection('people').insertOne(person1Fixture, cb));

    it('retrieves a person document in the database', (cb) => {
      request.get(`person/${person1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt  = new Date(clientRes.body.lastSeenAt);
        clientRes.body.isBrowsable = true;

        assertContains(clientRes.body, newPerson1Fixture);

        cb(null);
      });
    });
  });

  describe('Update Person by Id Route - PUT /:id', () => {
    it('updates a document by id and responds with a 204', (cb) => {
      connection.db.collection('people').insertOne(person1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`person/${person1Fixture._id.toString()}`, { json: updatePerson1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('people').findOne({ _id: person1Fixture._id }, (err, person) => {
            if (err) { return cb(err); }

            assertContains(person, updatePerson1Fixture);

            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      connection.db.collection('people').insertOne(person1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put('person/5d9e362ece1cf00fa05efb96', { json: updatePerson1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 404);
          cb(null);
        });
      });
    });
  });

  describe('Remove Person Route - DELETE /:id', () => {
    beforeEach( (cb) => connection.db.collection('people').insertOne(person1Fixture, cb));

    it('removes a person document from the database', (cb) => {
      request.delete(`person/${person1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('people').findOne({ _id: person1Fixture._id }, (err, person) => {
          if (err) { return cb(err); }

          assert.ok(person.removedAt instanceof Date);
          cb(null);
        });
      });
    });
  });

  describe('Restore Person Route - POST /restore/:id', () => {
    beforeEach( (cb) => {
      connection.db.collection('people').insertOne(
        Object.assign({}, person1Fixture, { removedAt: new Date() }),
        cb
      );
    });

    it('restores a person document in the database', (cb) => {
      request.post(`person/restore/${person1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('people').findOne({ _id: person1Fixture._id }, (err, person) => {
          if (err) { return cb(err); }

          assert.ok(!person.removedAt);

          cb(null);
        });
      });
    });
  });
});
