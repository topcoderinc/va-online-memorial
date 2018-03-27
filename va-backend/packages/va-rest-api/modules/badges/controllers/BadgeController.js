'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Badge controller
 */
const BadgeService = require('../services/BadgeService');

/**
 * Search badges
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield BadgeService.search(req.query, req.user));
}

/**
 * Create badge
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield BadgeService.create(req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield BadgeService.getSingle(req.params.id));
}

/**
 * Update badge
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield BadgeService.update(req.params.id, req.body));
}

/**
 * Delete badge
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield BadgeService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve badge
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield BadgeService.approve(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Reject badge
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield BadgeService.reject(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Salute badge
 * @param req the request
 * @param res the response
 */
function* salute(req, res) {
  yield BadgeService.salute(req.params.id, req.user.id);
  res.status(200).end();
}

/**
 * Check whether current user has saluted the badge
 * @param req the request
 * @param res the response
 */
function* isSaluted(req, res) {
  res.json(yield BadgeService.isSaluted(req.params.id, req.user.id));
}

/**
 * Share badge
 * @param req the request
 * @param res the response
 */
function* share(req, res) {
  yield BadgeService.share(req.params.id, req.user.id);
  res.status(200).end();
}

module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  approve,
  reject,
  salute,
  isSaluted,
  share
};
