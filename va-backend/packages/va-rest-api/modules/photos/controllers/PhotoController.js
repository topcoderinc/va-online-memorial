'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Photo controller
 */
const PhotoService = require('../services/PhotoService');

/**
 * Search photos
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield PhotoService.search(req.query, req.user));
}

/**
 * Create photo
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield PhotoService.create(req.files, req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield PhotoService.getSingle(req.params.id));
}

/**
 * Update photo
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield PhotoService.update(req.params.id, req.files, req.body));
}

/**
 * Delete photo
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield PhotoService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve photo
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield PhotoService.approve(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Reject photo
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield PhotoService.reject(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Salute photo
 * @param req the request
 * @param res the response
 */
function* salute(req, res) {
  yield PhotoService.salute(req.params.id, req.user.id);
  res.status(200).end();
}

/**
 * Check whether current user has saluted the photo
 * @param req the request
 * @param res the response
 */
function* isSaluted(req, res) {
  res.json(yield PhotoService.isSaluted(req.params.id, req.user.id));
}

/**
 * Share photo
 * @param req the request
 * @param res the response
 */
function* share(req, res) {
  yield PhotoService.share(req.params.id, req.user.id);
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
