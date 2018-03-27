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
  '/nextOfKins': {
    get: {
      auth: jwtAuth,
      controller: 'NextOfKinController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'NextOfKinController',
      method: 'create',
      file: true
    }
  },
  '/nextOfKins/:id': {
    get: {
      auth: jwtAuth,
      controller: 'NextOfKinController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'NextOfKinController',
      method: 'update',
      file: true
    },
    delete: {
      auth: jwtAuth,
      controller: 'NextOfKinController',
      method: 'remove'
    }
  },
  '/nextOfKins/:id/approve': {
    put: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'NextOfKinController',
      method: 'approve'
    }
  },
  '/nextOfKins/:id/reject': {
    put: {
      auth: jwtAuth,
      access: [modelConstants.UserRoles.Admin],
      controller: 'NextOfKinController',
      method: 'reject'
    }
  }
};
