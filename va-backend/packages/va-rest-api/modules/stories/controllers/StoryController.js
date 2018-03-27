'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Story controller
 */
const StoryService = require('../services/StoryService');

/**
 * Search stories
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield StoryService.search(req.query, req.user));
}

/**
 * Create story
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield StoryService.create(req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield StoryService.getSingle(req.params.id));
}

/**
 * Update story
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield StoryService.update(req.params.id, req.body));
}

/**
 * Delete story
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield StoryService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve story
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield StoryService.approve(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Reject story
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield StoryService.reject(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Salute story
 * @param req the request
 * @param res the response
 */
function* salute(req, res) {
  yield StoryService.salute(req.params.id, req.user.id);
  res.status(200).end();
}

/**
 * Check whether current user has saluted the story
 * @param req the request
 * @param res the response
 */
function* isSaluted(req, res) {
  res.json(yield StoryService.isSaluted(req.params.id, req.user.id));
}

/**
 * Share story
 * @param req the request
 * @param res the response
 */
function* share(req, res) {
  yield StoryService.share(req.params.id, req.user.id);
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
