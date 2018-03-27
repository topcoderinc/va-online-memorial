'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Next of kin controller
 */
const NextOfKinService = require('../services/NextOfKinService');

/**
 * Search next of kins
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield NextOfKinService.search(req.query));
}

/**
 * Create next of kin
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield NextOfKinService.create(req.files, req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield NextOfKinService.getSingle(req.params.id));
}

/**
 * Update next of kin
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield NextOfKinService.update(req.params.id, req.files, req.body));
}

/**
 * Delete next of kin
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield NextOfKinService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve next of kin
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield NextOfKinService.approve(req.params.id, req.user.id);
  res.status(200).end();
}

/**
 * Reject next of kin
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield NextOfKinService.reject(req.params.id, req.body, req.user.id);
  res.status(200).end();
}

module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  approve,
  reject
};
