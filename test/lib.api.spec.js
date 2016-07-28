/* eslint-disable max-len */
/* global describe it */

const config = require('./config');
const assert = require('assert');
const sinon  = require('sinon');
const Api    = require('../lib/api');
const logger = require('./mock/logger');

describe('new Api(config, logger) -> api', () => {

  describe('#start(cb(err))', () => {
    it('starts the database and server', sinon.test((cb) => {
      const api = new Api(config, logger);

      sinon.stub(api.database, 'connect').callsArgWith(0, null);
      sinon.stub(api.server,   'listen').callsArgWith(0, null);

      api.start((err, result) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(api.database.connect);
        sinon.assert.calledOnce(api.server.listen);

        assert.deepEqual(result, { port: 8050 });

        cb(null);
      });
    }));
  });

  describe('#stop(cb(err))', () => {
    it('starts the database and server', sinon.test((cb) => {
      const api = new Api(config, logger);

      api.isRunning = true;

      sinon.stub(api.database, 'disconnect').callsArgWith(0, null);
      sinon.stub(api.server,   'close').callsArgWith(0, null);

      api.stop((err) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(api.database.disconnect);
        sinon.assert.calledOnce(api.server.close);

        cb(null);
      });
    }));
  });
});
