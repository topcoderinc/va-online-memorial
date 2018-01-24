'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * User controller
 */
const UserService = require('../services/UserService');

/**
 * Register user
 * @param req the request
 * @param res the response
 */
function* register(req, res) {
  res.json(yield UserService.register(req.body));
}

/**
 * Login user
 * @param req the request
 * @param res the response
 */
function* login(req, res) {
  res.json(yield UserService.login(req.body));
}

module.exports = {
  register,
  login
};
