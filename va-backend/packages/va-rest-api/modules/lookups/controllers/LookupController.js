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
 * Get countries
 * @param req the request
 * @param res the response
 */
function* getCountries(req, res) {
  res.json(yield LookupService.getCountries(req.query));
}

/**
 * Get cemeteries
 * @param req the request
 * @param res the response
 */
function* getCemeteries(req, res) {
  res.json(yield LookupService.getCemeteries(req.query));
}

/**
 * Get badge types
 * @param req the request
 * @param res the response
 */
function* getBadgeTypes(req, res) {
  res.json(yield LookupService.getBadgeTypes(req.query));
}

/**
 * Get event types
 * @param req the request
 * @param res the response
 */
function* getEventTypes(req, res) {
  res.json(yield LookupService.getEventTypes(req.query));
}

/**
 * Get campaigns
 * @param req the request
 * @param res the response
 */
function* getCampaigns(req, res) {
  res.json(yield LookupService.getCampaigns(req.query));
}

module.exports = {
  getBranches,
  getRanks,
  getWars,
  getCountries,
  getCemeteries,
  getBadgeTypes,
  getEventTypes,
  getCampaigns
};
