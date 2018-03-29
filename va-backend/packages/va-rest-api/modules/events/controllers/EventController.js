'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Event controller
 */
const EventService = require('../services/EventService');

/**
 * Search events
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield EventService.search(req.query, req.user));
}

/**
 * Create event
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield EventService.create(req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield EventService.getSingle(req.params.id));
}

/**
 * Update event
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield EventService.update(req.params.id, req.body));
}

/**
 * Delete event
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield EventService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve event
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield EventService.approve(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Reject event
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield EventService.reject(req.params.id, req.user);
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
