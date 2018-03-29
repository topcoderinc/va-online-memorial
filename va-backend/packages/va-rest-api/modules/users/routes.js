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
  '/users': {
    get: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'search'
    }
  },
  '/users/:id': {
    get: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'update'
    }
  },
  '/me': {
    get: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'getMe'
    }
  },
  '/me/deactivate': {
    put: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'deactivateMe'
    }
  },
  '/me/activate': {
    put: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'activateMe'
    }
  },
  '/me/notificationPreferences': {
    get: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'getNotificationPreferences'
    },
    put: {
      auth: jwtAuth,
      controller: 'UserController',
      method: 'saveNotificationPreferences'
    }
  }
};
