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
  '/events': {
    get: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'create'
    }
  },
  '/events/:id': {
    get: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'remove'
    }
  },
  '/events/:id/approve': {
    put: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'approve'
    }
  },
  '/events/:id/reject': {
    put: {
      auth: jwtAuth,
      controller: 'EventController',
      method: 'reject'
    }
  }
};
