'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * User controller
 */
const UserService = require('../services/UserService');

/**
 * Search users
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield UserService.search(req.query));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield UserService.getSingle(req.params.id));
}

/**
 * Update user
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield UserService.update(req.params.id, req.body, req.user));
}

/**
 * Get me
 * @param req the request
 * @param res the response
 */
function* getMe(req, res) {
  res.json(yield UserService.getMe(req.user.id));
}

/**
 * Deactivate me
 * @param req the request
 * @param res the response
 */
function* deactivateMe(req, res) {
  yield UserService.deactivateMe(req.user.id);
  res.status(200).end();
}

/**
 * Activate me
 * @param req the request
 * @param res the response
 */
function* activateMe(req, res) {
  yield UserService.activateMe(req.user.id);
  res.status(200).end();
}

/**
 * Get notification preferences
 * @param req the request
 * @param res the response
 */
function* getNotificationPreferences(req, res) {
  res.json(yield UserService.getNotificationPreferences(req.user.id));
}

/**
 * Save notification preferences
 * @param req the request
 * @param res the response
 */
function* saveNotificationPreferences(req, res) {
  res.json(yield UserService.saveNotificationPreferences(req.user.id, req.body));
}

module.exports = {
  search,
  getSingle,
  update,
  getMe,
  deactivateMe,
  activateMe,
  getNotificationPreferences,
  saveNotificationPreferences
};
