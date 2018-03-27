'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Testimonial controller
 */
const TestimonialService = require('../services/TestimonialService');

/**
 * Search testimonials
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield TestimonialService.search(req.query, req.user));
}

/**
 * Create testimonial
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  req.body.createdBy = req.user.id;
  res.json(yield TestimonialService.create(req.body));
}

/**
 * Get single
 * @param req the request
 * @param res the response
 */
function* getSingle(req, res) {
  res.json(yield TestimonialService.getSingle(req.params.id));
}

/**
 * Update testimonial
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  req.body.updatedBy = req.user.id;
  res.json(yield TestimonialService.update(req.params.id, req.body));
}

/**
 * Delete testimonial
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  yield TestimonialService.remove(req.params.id);
  res.status(200).end();
}

/**
 * Approve testimonial
 * @param req the request
 * @param res the response
 */
function* approve(req, res) {
  yield TestimonialService.approve(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Reject testimonial
 * @param req the request
 * @param res the response
 */
function* reject(req, res) {
  yield TestimonialService.reject(req.params.id, req.user);
  res.status(200).end();
}

/**
 * Salute testimonial
 * @param req the request
 * @param res the response
 */
function* salute(req, res) {
  yield TestimonialService.salute(req.params.id, req.user.id);
  res.status(200).end();
}

/**
 * Check whether current user has saluted the testimonial
 * @param req the request
 * @param res the response
 */
function* isSaluted(req, res) {
  res.json(yield TestimonialService.isSaluted(req.params.id, req.user.id));
}

/**
 * Share testimonial
 * @param req the request
 * @param res the response
 */
function* share(req, res) {
  yield TestimonialService.share(req.params.id, req.user.id);
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
