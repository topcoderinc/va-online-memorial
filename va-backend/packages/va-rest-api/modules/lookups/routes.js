'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Contains all routes.
 */
const constants = require('../../constants');

const jwtAuth = constants.Passports.jwt;

module.exports = {
  '/branches': {
    get: {
      auth: jwtAuth,
      controller: 'LookupController',
      method: 'getBranches'
    }
  },
  '/ranks': {
    get: {
      auth: jwtAuth,
      controller: 'LookupController',
      method: 'getRanks'
    }
  },
  '/wars': {
    get: {
      auth: jwtAuth,
      controller: 'LookupController',
      method: 'getWars'
    }
  },
  '/cemeteries': {
    get: {
      auth: jwtAuth,
      controller: 'LookupController',
      method: 'getCemeteries'
    }
  }
};
