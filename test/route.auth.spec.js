/* global describe it before beforeEach after */

require('./config');
require('./mock/jwt');

let request  = require('request');
const assert = require('assert');
const nock   = require('nock');

const token1 = require('./fixture/auth0/token-1');
const error1 = require('./fixture/auth0/error-1');
const user1  = require('./fixture/auth0/user-1');

const api = require('../');

request = request.defaults({ baseUrl: 'http://localhost:8050' });

const email = 'a@a.com';

describe('Auth Routes', () => {

  before(cb => api.start(cb));
  beforeEach((cb) => {
    api.server.expressApp.request.user = { user: { email } };
    cb(null);
  });
  after( cb => api.stop(cb));

  describe('DB Auth - GET /auth', () => {

    const auth0Nochk = nock('https://keepers-co.auth0.com').post('/oauth/ro');

    it('responds with a 200 code and a user token object', (cb) => {
      const authd = auth0Nochk.reply(200, token1);

      request.post('/auth', { json: user1 }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 200);
        assert.equal(clientRes.body.token_id, token1.token_id);
        assert.equal(clientRes.body.tokenType, token1.token_type);
        assert.equal(clientRes.body.accessToken, token1.access_token);

        authd.done();
        cb(null);
      });
    });

    it('responds with a 400 error when password or username are missing', (cb) => {
      request.post('/auth', (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);

        cb(null);
      });
    });

    it('responds with a 401 code when wron username or password', (cb) => {
      const authd = auth0Nochk.reply(401, error1);

      request.post('/auth', { json: user1 }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 401);
        assert.equal(clientRes.body.error, error1.error);
        assert.equal(clientRes.body.errorDescription, error1.error_description);

        authd.done();
        cb(null);
      });
    });
  });

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
