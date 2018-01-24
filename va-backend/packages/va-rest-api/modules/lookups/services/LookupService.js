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
  Cemetery
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
  const count = yield model.count();
  const items = yield model.findAll({ ...filters });
  return {
    ...filters,
    count,
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
 * Get cemeteries
 * @param {object} filters - The query filters object
 */
function* getCemeteries(filters) {
  return yield getPaginatedLookups(Cemetery, filters);
}

getCemeteries.schema = paginationSchema;

module.exports = {
  getBranches,
  getRanks,
  getWars,
  getCemeteries
};

logger.buildService(module.exports);
