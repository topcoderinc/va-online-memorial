'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Lookup service
 */
const Joi = require('joi');
const _ = require('lodash');
const logger = require('../../../common/logger');
const { DefaultPagination } = require('../../../constants');
const {
  Branch,
  Rank,
  War,
  Country,
  Cemetery,
  BadgeType,
  EventType,
  Campaign
} = require('@va/models');

// Pagination schema
const paginationSchema = {
  filters: Joi.object().keys({
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0)
  })
};

/**
 * Helper method to get paginated lookups
 * @param {model} model - The sequelize model to use
 * @param {object} filters - The pagination filters
 */
function* getPaginatedLookups(model, filters) {
  _.defaults(filters, DefaultPagination);
  const total = yield model.count();
  const items = yield model.findAll({ ...filters });
  return {
    ...filters,
    total,
    items
  };
}

/**
 * Get branches
 * @param {object} filters - The query filters object
 */
function* getBranches(filters) {
  return yield getPaginatedLookups(Branch, filters);
}

getBranches.schema = paginationSchema;

/**
 * Get ranks
 * @param {object} filters - The query filters object
 */
function* getRanks(filters) {
  return yield getPaginatedLookups(Rank, filters);
}

getRanks.schema = paginationSchema;

/**
 * Get wars
 * @param {object} filters - The query filters object
 */
function* getWars(filters) {
  return yield getPaginatedLookups(War, filters);
}

getWars.schema = paginationSchema;

/**
 * Get countries
 * @param {object} filters - The query filters object
 */
function* getCountries(filters) {
  return yield getPaginatedLookups(Country, filters);
}

getCountries.schema = paginationSchema;

/**
 * Get cemeteries
 * @param {object} filters - The query filters object
 */
function* getCemeteries(filters) {
  return yield getPaginatedLookups(Cemetery, filters);
}

getCemeteries.schema = paginationSchema;

/**
 * Get badge types
 * @param {object} filters - The query filters object
 */
function* getBadgeTypes(filters) {
  return yield getPaginatedLookups(BadgeType, filters);
}

getBadgeTypes.schema = paginationSchema;

/**
 * Get event types
 * @param {object} filters - The query filters object
 */
function* getEventTypes(filters) {
  return yield getPaginatedLookups(EventType, filters);
}

getEventTypes.schema = paginationSchema;

/**
 * Get campaigns
 * @param {object} filters - The query filters object
 */
function* getCampaigns(filters) {
  return yield getPaginatedLookups(Campaign, filters);
}

getCampaigns.schema = paginationSchema;

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

logger.buildService(module.exports);
