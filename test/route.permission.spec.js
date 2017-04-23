/* eslint-disable max-len */
/* global describe it before beforeEach after */

require('./config')

let request = require('request')
const assert = require('assert')
const assertContains = require('assert-contains')

const permission1Fixture = require('./fixture/permission/permission-1')
const permission2Fixture = require('./fixture/permission/permission-2')

const newPermission1Fixture = require('./fixture/permission/new-permission-1')
const newPermission2Fixture = require('./fixture/permission/new-permission-2')

const updatePermission1Fixture = require('./fixture/permission/update-permission-1')

const api = require('../')
const connection = api.database.mongoose.connection

request = request.defaults({ baseUrl: 'http://localhost:8050' })

describe('Permission Routes', () => {
  before(done => api.start(done))
  beforeEach(() => connection.db.collection('permissions').remove({}))
  after(done => api.stop(done))

  describe('Create Permission Route - POST /', () => {
    it('creates a new permission document in the database and responds 201 status code', (cb) => {
      request.post('/permission', { json: newPermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 201)

        connection.db.collection('permissions').find({}).toArray((err, permissions) => {
          if (err) { return cb(err) }

          assert.equal(permissions.length, 1)

          const permission = permissions[0]
          permission._id = permission._id.toString()
          assertContains(permission, newPermission1Fixture)

          cb(null)
        })
      })
    })

    it('responds with a 400 error if the body of the request does not align with the permission schema', (cb) => {
      request.post('/permission', { json: {} }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 400)
        assert.ok(clientRes.body.match(/ValidationError/))

        cb(null)
      })
    })
  })

  describe('Query Permission Route - GET /', () => {
    beforeEach(done => connection.db.collection('permissions')
      .insertMany([permission1Fixture, permission2Fixture], done))

    it('searches for permission documents in the database and responds with 200 status code', (cb) => {
      request.get('/permission', { json: true }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 200)
        assertContains(clientRes.body, [newPermission1Fixture, newPermission2Fixture])

        cb(null)
      })
    })
  })

  describe('Get Permission Route - GET /:id', () => {
    beforeEach(done => connection.db.collection('permissions').insertOne(permission1Fixture, done))

    it('returns an permission document in the database and responds with 200 status code', (cb) => {
      request.get(`permission/${permission1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 200)
        assertContains(clientRes.body, newPermission1Fixture)

        cb(null)
      })
    })

    it('responds with a 404 error if an permission does not exist with the given id', (cb) => {
      request.get(`permission/${permission2Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 404)

        cb(null)
      })
    })
  })

  describe('Update Permission by Id Route - PUT /:id', () => {
    beforeEach(done => connection.db.collection('permissions').insertOne(permission1Fixture, done))

    it('updates an permission document and responds with a 204 status code', (cb) => {
      request.put(`permission/${permission1Fixture._id.toString()}`,
      { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 204)

        connection.db.collection('permissions').findOne({ _id: permission1Fixture._id }, (err, permission) => {
          if (err) { return cb(err) }

          assertContains(permission, { name: 'user-get' })

          cb(null)
        })
      })
    })

    it('responds with a 404 error if an permission does not exist with the given id', (cb) => {
      request.put('permission/5d9e362ece1cf00fa05efb96', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 404)
        cb(null)
      })
    })

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.put('permission/0', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 400)

        cb(null)
      })
    })
  })

  describe('Remove Permission Route - DELETE /:id', () => {
    beforeEach(done => connection.db.collection('permissions').insertOne(permission1Fixture, done))

    it('removes a permission document from the database and responds with 204 status code', (cb) => {
      request.delete(`permission/${permission1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 204)

        connection.db.collection('permissions').findOne({ _id: permission1Fixture._id }, (err, permission) => {
          if (err) { return cb(err) }

          assert.ok(permission.removedAt instanceof Date)
          cb(null)
        })
      })
    })

    it('responds with a 404 error if an permission does not exist with the given id', (cb) => {
      request.delete('permission/5d9e362ece1cf00fa05efb96', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 404)
        cb(null)
      })
    })

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.delete('permission/0', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 400)

        cb(null)
      })
    })
  })

  describe('Restore Permission Route - POST /restore/:id', () => {
    beforeEach((done) => {
      connection.db.collection('permissions').insertOne(
        Object.assign({}, permission1Fixture, { removedAt: new Date() }),
        done
      )
    })

    it('restores a permission document in the database and responds with 204 status code', (cb) => {
      request.post(`permission/restore/${permission1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 204)

        connection.db.collection('permissions').findOne({ _id: permission1Fixture._id }, (err, permission) => {
          if (err) { return cb(err) }

          assert.ok(!permission.removedAt)

          cb(null)
        })
      })
    })

    it('responds with a 404 error if an permission does not exist with the given id', (cb) => {
      request.post('permission/restore/5d9e362ece1cf00fa05efb96', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 404)
        cb(null)
      })
    })

    it('responds with a 400 if the given id is not a valid ObjectId', (cb) => {
      request.post('permission/restore/0', { json: updatePermission1Fixture }, (err, clientRes) => {
        if (err) { return cb(err) }

        assert.equal(clientRes.statusCode, 400)

        cb(null)
      })
    })
  })
})
