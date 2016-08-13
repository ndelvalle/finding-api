/* eslint-disable max-len */
/* global describe it */

const sinon                = require('sinon');
const assert               = require('assert');
const Mongoose             = require('mongoose').Mongoose;
const mongooseTimestamp    = require('mongoose-cu-timestamps');
const mongooseSoftRemove   = require('mongoose-soft-remove');
const mongooseCountAndFind = require('mongoose-count-and-find');

// NOTE: Fix for sinon ClockDate
const Types = Mongoose.prototype.Schema.Types;
Types.ClockDate = Types.Date;

const logger   = require('./mock/logger');
const Database = require('../lib/database');


describe('new Database(config, logger) -> database', () => {
  it('exposes the config and logger as properties', () => {
    const config = {};
    const database = new Database(config, logger);

    assert.equal(database.config, config);
    assert.equal(database.logger, logger);
  });

  it('creates an instance of mongoose and exposes it as a property', () => {
    const database = new Database({}, logger);
    assert.ok(database.mongoose instanceof Mongoose);
  });

  it('loads required global mongoose plugins', () => {
    const database = new Database({}, logger);

    const requiredPlugins = [
      mongooseTimestamp,
      mongooseSoftRemove,
      mongooseCountAndFind
    ];

    for (let i = 0; i < requiredPlugins.length; i += 1) {
      let isLoaded = false;
      for (let j = 0; j < database.mongoose.plugins.length; j += 1) {
        if (database.mongoose.plugins[j][0] === requiredPlugins[i]) {
          isLoaded = true;
          break;
        }
      }
      assert.ok(isLoaded);
    }
  });

  describe('#connect(cb(err))', () => {

    it('calls connect on the internal mongoose instance', sinon.test(() => {
      const config   = { mongo: { url: 'MONGO_URL' } };
      const database = new Database(config, logger);
      sinon.stub(database.mongoose, 'connect').callsArgWith(1, null);
      const cbStub = sinon.stub();

      database.connect(cbStub);

      sinon.assert.calledOnce(database.mongoose.connect);
      sinon.assert.calledWith(database.mongoose.connect, config.mongo.url);
      sinon.assert.calledOnce(cbStub);
    }));
  });


  describe('#disconnect(cb(err))', () => {

    it('calls disconnect on the internal mongoose instance', sinon.test(() => {
      const database = new Database({}, logger);
      sinon.stub(database.mongoose, 'disconnect').callsArgWith(0, null);
      const cbStub = sinon.stub();

      database.disconnect(cbStub);

      sinon.assert.calledOnce(database.mongoose.disconnect);
      sinon.assert.calledOnce(cbStub);
    }));
  });


  describe('#model(modelName, [schema]) -> Model', () => {

    it('is an alias to mongoose.model', sinon.test(() => {
      const database = new Database({}, logger);
      sinon.stub(database.mongoose, 'model').returns('MODEL');

      database.model(1, 2, 3, 4, 5, 6, 7, 8);

      sinon.assert.calledOnce(database.mongoose.model);
      sinon.assert.calledWith(database.mongoose.model, 1, 2, 3, 4, 5, 6, 7, 8);
    }));
  });


  describe('#ping(cb)', () => {

    it('is an alias to mongoose.model', sinon.test(() => {
      const database     = new Database({}, logger);
      const adminApiStub = {
        ping: sinon.stub().callsArgWith(0, null, 'RESULT')
      };
      database.mongoose.connection.db = {
        admin: () => adminApiStub
      };
      const stubCb = sinon.stub();

      database.ping(stubCb);

      sinon.assert.calledOnce(adminApiStub.ping);
      sinon.assert.calledOnce(stubCb);
      sinon.assert.calledWith(stubCb, null, 'RESULT');

      delete database.mongoose.connection.db;
    }));
  });
});
