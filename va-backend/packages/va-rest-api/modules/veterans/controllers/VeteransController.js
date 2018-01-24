'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Veterans controller
 */
const VeteransService = require('../services/VeteransService');

/**
 * Create veteran
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield VeteransService.create(req.body));
}

/**
 * Get all
 * @param req the request
 * @param res the response
 */
function* getAll(req, res) {
  res.json(yield VeteransService.getAll(req.query));
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
 * Update
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield VeteransService.update(req.params.id, req.body));
}

/**
 * Delete
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield VeteransService.remove(req.params.id);
  res.sendStatus(200);
}

module.exports = {
  getAll,
  create,
  getSingle,
  update,
  remove
};
