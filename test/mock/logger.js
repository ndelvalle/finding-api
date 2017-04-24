const sinon = require('sinon')

const logger = {
  child () { return this },
  silly: () => sinon.stub(),
  debug: () => sinon.stub(),
  verbose: () => sinon.stub(),
  info: () => sinon.stub(),
  warn: () => sinon.stub(),
  error: () => sinon.stub()
}

module.exports = logger
