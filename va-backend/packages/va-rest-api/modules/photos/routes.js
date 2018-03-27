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
  '/photos': {
    get: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'create',
      file: true
    }
  },
  '/photos/:id': {
    get: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'update',
      file: true
    },
    delete: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'remove'
    }
  },
  '/photos/:id/approve': {
    put: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'approve'
    }
  },
  '/photos/:id/reject': {
    put: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'reject'
    }
  },
  '/photos/:id/salute': {
    put: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'salute'
    }
  },
  '/photos/:id/isSaluted': {
    get: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'isSaluted'
    }
  },
  '/photos/:id/share': {
    put: {
      auth: jwtAuth,
      controller: 'PhotoController',
      method: 'share'
    }
  }
};
