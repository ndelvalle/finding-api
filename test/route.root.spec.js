/* global describe it before after */

require('./config.js');

let request  = require('request');
const assert = require('assert');
const sinon  = require('sinon');

const api = require('../');

request = request.defaults({ baseUrl: 'http://localhost:8050' });


describe('Root Routes', () => {

  before(done => api.start(done));
  after( done => api.stop(done));

  it('responds to a root request with a 200 status code', (cb) => {
    request.get('/', (err, clientRes) => {
      if (err) { return cb(err); }

      assert.equal(clientRes.statusCode, 200);
      cb(null);
    });
  });

  it('responds to a status request with a 204 status code', (cb) => {
    request.get('/status', (err, clientRes) => {
      if (err) { return cb(err); }

      assert.equal(clientRes.statusCode, 204);
      cb(null);
    });
  });

  it('responds to a status request with a 503 status code when service is unavailable', (cb) => {
    const stub = sinon.stub(api.database, 'ping').callsArgWith(0, null);

    request.get('/status/', (err, clientRes) => {
      if (err) { return cb(err); }

      assert.equal(clientRes.statusCode, 503);
      stub.restore();

      cb(null);
    });
  });
});
