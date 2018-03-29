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
  '/register': {
    post: {
      controller: 'SecurityController',
      method: 'register'
    }
  },
  '/login': {
    post: {
      controller: 'SecurityController',
      method: 'login'
    }
  },
  '/initiateForgotPassword': {
    post: {
      controller: 'SecurityController',
      method: 'initiateForgotPassword'
    }
  },
  '/changeForgotPassword': {
    post: {
      controller: 'SecurityController',
      method: 'changeForgotPassword'
    }
  },
  '/updatePassword': {
    put: {
      auth: jwtAuth,
      controller: 'SecurityController',
      method: 'updatePassword'
    }
  }
};
