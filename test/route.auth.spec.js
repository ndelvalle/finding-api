/* global describe it before beforeEach after */

require('./config.js');
require('./mock/jwt.js');

let request  = require('request');
const assert = require('assert');
// const sinon  = require('sinon');

const api = require('../');

request = request.defaults({ baseUrl: 'http://localhost:8050' });

const email = 'a@a.com';

describe('Auth Routes', () => {

  before((cb) => api.start(cb));
  beforeEach((cb) => {
    api.server.expressApp.request.user = { user: { email } };
    cb(null);
  });
  after( (cb) => api.stop(cb));

  describe('DB Auth Fail Callback - GET /auth/db-fail', () => {
    it('responds with a 200 code and a session user object', (cb) => {
      request.get('/auth/db-fail', (err, clientRes) => {
        if (err) { return cb(err); }

        const body = JSON.parse(clientRes.body);

        assert.equal(clientRes.statusCode, 200);
        assert.equal(body.user.email, email);
        cb(null);
      });
    });

    it('responds with 500 error when user session does not exist', (cb) => {
      api.server.expressApp.request.user = null;

      request.get('/auth/db-fail', (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 500);
        cb(null);
      });
    });
  });

  describe('DB Auth Callback - GET /auth/db-callback', () => {
    it('responds with a 200 code and a session user object', (cb) => {
      request.get('/auth/db-callback', (err, clientRes) => {
        if (err) { return cb(err); }

        const body = JSON.parse(clientRes.body);

        assert.equal(clientRes.statusCode, 200);
        assert.equal(body.user.email, email);
        cb(null);
      });
    });

    it('responds with 500 error when user session does not exist', (cb) => {
      api.server.expressApp.request.user = null;

      request.get('/auth/db-callback', (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 500);
        cb(null);
      });
    });
  });

});
