'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Veterans controller
 */
const VeteransService = require('../services/VeteransService');

/**
 * Search veterans
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield VeteransService.search(req.query));
}

/**
 * Create veteran
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield VeteransService.create(req.files, req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield VeteransService.getSingle(req.params.id));
}

/**
 * Update veteran
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield VeteransService.update(req.params.id, req.files, req.body));
}

/**
 * Delete veteran
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield VeteransService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Get related veterans
 * @param req the request
 * @param res the response
 */
function* getRelated(req, res) {
  res.json(yield VeteransService.getRelated(req.params.id, req.query));
}

module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  getRelated
};
