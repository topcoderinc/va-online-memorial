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
  '/testimonials': {
    get: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'create'
    }
  },
  '/testimonials/:id': {
    get: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'getSingle'
    },
    put: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'update'
    },
    delete: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'remove'
    }
  },
  '/testimonials/:id/approve': {
    put: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'approve'
    }
  },
  '/testimonials/:id/reject': {
    put: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'reject'
    }
  },
  '/testimonials/:id/salute': {
    put: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'salute'
    }
  },
  '/testimonials/:id/isSaluted': {
    get: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'isSaluted'
    }
  },
  '/testimonials/:id/share': {
    put: {
      auth: jwtAuth,
      controller: 'TestimonialController',
      method: 'share'
    }
  }
};
