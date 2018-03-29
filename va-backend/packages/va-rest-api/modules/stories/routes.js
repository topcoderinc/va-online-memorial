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
  '/stories': {
    get: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'create'
    }
  },
  '/stories/:id': {
    get: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'remove'
    }
  },
  '/stories/:id/approve': {
    put: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'approve'
    }
  },
  '/stories/:id/reject': {
    put: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'reject'
    }
  },
  '/stories/:id/salute': {
    put: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'salute'
    }
  },
  '/stories/:id/isSaluted': {
    get: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'isSaluted'
    }
  },
  '/stories/:id/share': {
    put: {
      auth: jwtAuth,
      controller: 'StoryController',
      method: 'share'
    }
  }
};
