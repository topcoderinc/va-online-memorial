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
  '/badges': {
    get: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'create'
    }
  },
  '/badges/:id': {
    get: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'remove'
    }
  },
  '/badges/:id/approve': {
    put: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'approve'
    }
  },
  '/badges/:id/reject': {
    put: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'reject'
    }
  },
  '/badges/:id/salute': {
    put: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'salute'
    }
  },
  '/badges/:id/isSaluted': {
    get: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'isSaluted'
    }
  },
  '/badges/:id/share': {
    put: {
      auth: jwtAuth,
      controller: 'BadgeController',
      method: 'share'
    }
  }
};
