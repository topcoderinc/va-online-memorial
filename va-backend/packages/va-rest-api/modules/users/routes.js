'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Contains all routes.
 */

module.exports = {
  '/register': {
    post: {
      controller: 'UserController',
      method: 'register'
    }
  },
  '/login': {
    post: {
      controller: 'UserController',
      method: 'login'
    }
  }
};
