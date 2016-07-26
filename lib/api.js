const async    = require('async');
const Database = require('./database');
const Auth0    = require('./auth0');
const Server   = require('./server');

class Api {

  constructor(config, logger) {
    this.config    = config;
    this.logger    = logger.child({ context: 'Api' });
    this.isRunning = false;
    this.database  = new Database(config, this.logger);
    this.auth0     = new Auth0(config);
    this.server    = new Server(config, this.logger, this.database, this.auth0);
  }

  start(cb) {
    if (this.isRunning) {
      throw new Error('Cannot start Api because it is already running');
    }
    this.isRunning = true;

    this.logger.verbose('Starting Api');
    async.parallel([
      (cb) => this.database.connect(cb),
      (cb) => this.server.listen(cb)
    ], (err) => {
      if (err) { return cb(err); }

      this.logger.verbose('Api ready and awaiting requests');
      cb(null, { url: this.config.server.url });
    });
  }

  stop(cb) {
    if (!this.isRunning) { throw new Error('Cannot stop Api because it is already stopping'); }
    this.isRunning = false;

    this.logger.verbose('Stopping Api');
    async.parallel([
      (cb) => { this.database.disconnect(cb); },
      (cb) => { this.server.close(cb); }
    ], (err) => {
      if (err) { return cb(err); }

      this.logger.verbose('Api has closed all connections and successfully halted');
      cb(null);
    });
  }
}


module.exports = Api;
