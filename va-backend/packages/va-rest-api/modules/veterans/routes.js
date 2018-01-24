'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Contains all routes.
 */

const constants = require('../../constants');

const jwtAuth = constants.Passports.jwt;

module.exports = {
  '/veterans': {
    post: {
      auth: jwtAuth,
      access: ['admin'],
      controller: 'VeteransController',
      method: 'create'
    },
    get: {
      auth: jwtAuth,
      controller: 'VeteransController',
      method: 'getAll'
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
      access: ['admin'],
      controller: 'VeteransController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      access: ['admin'],
      controller: 'VeteransController',
      method: 'remove'
    }
  }
};
