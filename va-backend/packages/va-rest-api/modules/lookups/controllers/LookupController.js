'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Lookup controller
 */
const LookupService = require('../services/LookupService');

/**
 * Get branches
 * @param req the request
 * @param res the response
 */
function* getBranches(req, res) {
  res.json(yield LookupService.getBranches(req.query));
}

/**
 * Get ranks
 * @param req the request
 * @param res the response
 */
function* getRanks(req, res) {
  res.json(yield LookupService.getRanks(req.query));
}

/**
 * Get wars
 * @param req the request
 * @param res the response
 */
function* getWars(req, res) {
  res.json(yield LookupService.getWars(req.query));
}

/**
 * Get cemeteries
 * @param req the request
 * @param res the response
 */
function* getCemeteries(req, res) {
  res.json(yield LookupService.getCemeteries(req.query));
}

module.exports = {
  getBranches,
  getRanks,
  getWars,
  getCemeteries
};
