/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config');

let   request        = require('request');
const assert         = require('assert');
const assertContains = require('assert-contains');

const newPerson1Fixture    = require('./fixture/person/new-person-1');
const person1Fixture       = require('./fixture/person/person-1');
const updatePerson1Fixture = require('./fixture/person/update-person-1');

const api        = require('../');
const connection = api.database.mongoose.connection;


request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('Person Routes', () => {

  before(done => api.start(done));

  beforeEach(() => { api.server.expressApp.request.user = { organization: '57ad47e540ae419411780bbf' }; });
  beforeEach(() => connection.db.collection('persons').remove({}));

  after(done => api.stop(done));

  describe('Create Person Route - POST /', () => {
    it('creates a new person document in the database and responds 201 status code', (cb) => {
      request.post('/person', { json: newPerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 201);

        connection.db.collection('persons').find({}).toArray((err, persons) => {
          if (err) { return cb(err); }

          assert.equal(persons.length, 1);

          const person = persons[0];

          clientRes.body.lastSeenAt = new Date(clientRes.body.lastSeenAt);
          clientRes.body.createdAt  = new Date(clientRes.body.createdAt);
          clientRes.body.updatedAt  = new Date(clientRes.body.updatedAt);

          clientRes.body.contacts = clientRes.body.contacts.map(contact => {
            contact.createdAt = new Date(contact.createdAt);
            contact.updatedAt = new Date(contact.updatedAt);
            return contact;
          });

          clientRes.body.photos = clientRes.body.photos.map(photo => {
            photo.createdAt = new Date(photo.createdAt);
            photo.updatedAt = new Date(photo.updatedAt);
            return photo;
          });

          person._id          = person._id.toString();
          person.organization = person.organization.toString();

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

    it('responds with a 400 error if the body of the request does not align with the person schema', (cb) => {
      request.post('/person', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });

  describe('Query Persons Route - GET /', () => {
    beforeEach(done => connection.db.collection('persons').insertOne(person1Fixture, done));

    it('searches for persons documents in the database and respons with 200 status code', (cb) => {
      request.get('/person', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body = clientRes.body.map(person => {
          person.lastSeenAt  = new Date(person.lastSeenAt);
          person.isBrowsable = true;
          return person;
        });

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, [newPerson1Fixture]);

        cb(null);
      });
    });
  });

  describe.skip('Query Persons by geolocation Route - GET /', () => {
    beforeEach(done => connection.db.collection('persons').insertOne(person1Fixture, done));

    it('searches for persons documents by geolocation in the database', (cb) => {
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

    it('searches for persons documents by geolocation using 1km radius in the database', (cb) => {
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

    it('searches for persons documents by geolocation using 10km radius in the database', (cb) => {
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
    beforeEach(done => connection.db.collection('persons').insertOne(person1Fixture, done));

    it('retrieves a person document in the database and responds 200 status code', (cb) => {
      request.get(`person/${person1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        clientRes.body.lastSeenAt  = new Date(clientRes.body.lastSeenAt);
        clientRes.body.isBrowsable = true;

        assert.equal(clientRes.statusCode, 200);
        assertContains(clientRes.body, newPerson1Fixture);

        cb(null);
      });
    });

    it('responds with a 404 error when a person does not exist', (cb) => {
      request.get('person/57ce56f35a6fe8ba8baf0111', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);

        cb(null);
      });
    });
  });

  describe('Update Person by Id Route - PUT /:id', () => {
    it('updates a person document by id and responds with a 204 status code', (cb) => {
      connection.db.collection('persons').insertOne(person1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`person/${person1Fixture._id.toString()}`, { json: updatePerson1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('persons').findOne({ _id: person1Fixture._id }, (err, person) => {
            if (err) { return cb(err); }

            assertContains(person, updatePerson1Fixture);

            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      request.put('person/5d9e362ece1cf00fa05efb96', { json: updatePerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });
  });

  describe('Remove Person Route - DELETE /:id', () => {
    beforeEach(done => connection.db.collection('persons').insertOne(person1Fixture, done));

    it('removes a person document from the database', (cb) => {
      request.delete(`person/${person1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('persons').findOne({ _id: person1Fixture._id }, (err, person) => {
          if (err) { return cb(err); }

          assert.ok(person.removedAt instanceof Date);
          cb(null);
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      request.delete('person/5d9e362ece1cf00fa05efb96', { json: updatePerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });
  });

  describe('Restore Person Route - POST /restore/:id', () => {
    beforeEach(done => {
      connection.db.collection('persons').insertOne(
        Object.assign({}, person1Fixture, { removedAt: new Date() }),
        done
      );
    });

    it('restores a person document in the database', (cb) => {
      request.post(`person/restore/${person1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('persons').findOne({ _id: person1Fixture._id }, (err, person) => {
          if (err) { return cb(err); }

          assert.ok(!person.removedAt);

          cb(null);
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      request.post('person/restore/5d9e362ece1cf00fa05efb96', { json: updatePerson1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 404);
        cb(null);
      });
    });
  });
});
