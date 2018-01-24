'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Helper methods
 */
const moment = require('moment');
const _ = require('lodash');

/**
 * Create or update entity
 * @param {Sequelize model} Model - The sequelize model
 * @param {object} where - The where clause
 * @param {object} data - The entity data
 * @param {sequelize transaction} t - The sequelize transaction
 * @returns {array} Array with IDs
 */
function* createOrUpdateEntity(Model, where, data, t) {
  let entity = yield Model.findOne({ where }, t);
  if (!entity) {
    entity = yield Model.create(data, { transaction: t });
  } else {
    _.extend(entity, data);
    yield entity.save({ transaction: t });
  }
  return entity;
}

/**
 * Create or update lookup entities
 * @param {Sequelize model} Model - The sequelize model
 * @param {array} items - The lookup items array
 * @param {sequelize transaction} t - The sequelize transaction
 * @returns {array} Array with IDs
 */
function* createOrUpdateLookupEntities(Model, items, t) {
  const ids = [];
  for (let i = 0; i < items.length; i += 1) {
    const name = items[i].trim();
    if (name.length > 0) {
      const entity = yield createOrUpdateEntity(Model, { value: items[i] }, { value: items[i] }, t);
      if (_.indexOf(ids, entity.id) < 0) {
        ids.push(entity.id);
      }
    }
  }
  return ids;
}

/**
 * Format date.
 * @param {string} d - the string
 */
function formatDate(d) {
  if (!d || d.length === 0) return null;
  if (!moment(d, 'MM/DD/YYYY').isValid()) return null;
  return moment(d, 'MM/DD/YYYY').format('YYYY-MM-DD'); // Convert to format supported by sequelize
}

module.exports = {
  formatDate,
  createOrUpdateLookupEntities,
  createOrUpdateEntity
};
