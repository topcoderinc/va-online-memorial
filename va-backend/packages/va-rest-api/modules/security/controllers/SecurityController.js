'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Security controller
 */
const SecurityService = require('../services/SecurityService');

/**
 * Register user
 * @param req the request
 * @param res the response
 */
function* register(req, res) {
  res.json(yield SecurityService.register(req.body));
}

/**
 * Login user
 * @param req the request
 * @param res the response
 */
function* login(req, res) {
  res.json(yield SecurityService.login(req.body));
}

/**
 * Initiate forgot password
 * @param req the request
 * @param res the response
 */
function* initiateForgotPassword(req, res) {
  yield SecurityService.initiateForgotPassword(req.body);
  res.status(200).end();
}

/**
 * Change forgot password.
 * @param req the request
 * @param res the response
 */
function* changeForgotPassword(req, res) {
  yield SecurityService.changeForgotPassword(req.body);
  res.status(200).end();
}

/**
 * Update password
 * @param req the request
 * @param res the response
 */
function* updatePassword(req, res) {
  yield SecurityService.updatePassword(req.user.id, req.body);
  res.status(200).end();
}

module.exports = {
  register,
  login,
  initiateForgotPassword,
  changeForgotPassword,
  updatePassword
};
