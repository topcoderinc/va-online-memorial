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
  '/veterans': {
    get: {
      controller: 'VeteransController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'VeteransController',
      method: 'create',
      file: true
    }
  },
  '/veterans/:id': {
    get: {
      auth: jwtAuth,
      controller: 'VeteransController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'VeteransController',
      method: 'update',
      file: true
    },
    delete: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'VeteransController',
      method: 'remove'
    }
  },
  '/veterans/:id/related': {
    get: {
      auth: jwtAuth,
      controller: 'VeteransController',
      method: 'getRelated'
    }
  }
};
