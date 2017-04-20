const auth0            = require('auth0');
const ManagementClient = auth0.ManagementClient;

class Auth0 {
  constructor(config) {
    this.config     = config;
    this.management = new ManagementClient({
      token : this.config.token,
      domain: this.config.domain
    });
  }
}

module.exports = Auth0;
