const auth0            = require('auth0');
const ManagementClient = auth0.ManagementClient;

class Auth0 {

  constructor(config) {
    this.config = config;

    this.management = new ManagementClient({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJVY0lEVkpBeEhuN0FxUjdmVDUyaDJoanRVRWdQckZiUiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX19LCJpYXQiOjE0Njk1NzQ2MTQsImp0aSI6ImVlNDkyOWFjYzQwNTE5OTgxNjFhYjFmNDJjZWYyODhhIn0.lK2o6HpyVQ85asSTYR8fHIuOu50T9fjUtutzZOdOKBk', // eslint-disable-line
      domain: config.domain
    });
  }

}

module.exports = Auth0;
