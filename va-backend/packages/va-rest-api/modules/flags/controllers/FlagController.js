'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Flag controller
 */
const FlagService = require('../services/FlagService');

/**
 * Search flags
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield FlagService.search(req.query));
}

/**
 * Create flag
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield FlagService.create(req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield FlagService.getSingle(req.params.id));
}

/**
 * Update flag
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield FlagService.update(req.params.id, req.body));
}

/**
 * Delete flag
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield FlagService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Process flag
 * @param req the request
 * @param res the response
 */
function* processFlag(req, res) {
  yield FlagService.processFlag(req.params.id);
  res.status(200).end();
}


module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  processFlag
};
