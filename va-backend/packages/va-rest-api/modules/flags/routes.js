'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Contains all routes.
 */

const constants = require('../../constants');

const jwtAuth = constants.Passports.jwt;
const { modelConstants } = require('@va/models');

module.exports = {
  '/flags': {
    get: {
      auth: jwtAuth,
      controller: 'FlagController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'FlagController',
      method: 'create'
    }
  },
  '/flags/:id': {
    get: {
      auth: jwtAuth,
      controller: 'FlagController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'FlagController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      controller: 'FlagController',
      method: 'remove'
    }
  },
  '/flags/:id/process': {
    put: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'FlagController',
      method: 'processFlag'
    }
  }
};
