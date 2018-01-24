'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Data
 */
const co = require('co');
const _ = require('lodash');
const moment = require('moment');
const ProgressBar = require('ascii-progress');
const { csvHeaders } = require('../constants');
const logger = require('../common/logger');
const {
  Veteran,
  Burial,
  Cemetery,
  Kin,
  Rank,
  Branch,
  War,
  sequelize
} = require('@va/models');

/**
 * Process file
 * @param {array} file - The input file
 */
function* processFile(file) {
  const bar = new ProgressBar({
    schema: '[:bar] :percent processed',
    total: 100
  });
  const rowCount = file.length;
  let processingProgress = 0;
  const totalCount = {
    branches: 0,
    wars: 0,
    veterans: 0
  };

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
      const name = items[i].value.trim();
      if (name.length > 0) {
        const entity = yield createOrUpdateEntity(Model, { value: items[i].value }, items[i], t);
        if (_.indexOf(ids, entity.id) < 0) {
          ids.push(entity.id);
        }
      }
    }
    return ids;
  }

  /**
    * Read each row recursively.
    */
  function* processRow() {
    const row = file.shift();
    // Dataset for foreign addresses has an extra column so we need to skip it
    const hasExtraColumn = row.length - 1 > csvHeaders.length;
    // ignore header & rows with missing attributes
    if (_.intersection(row, csvHeaders).length < csvHeaders.length && _validate(row, hasExtraColumn)) {
      totalCount.veterans += 1;
      const cemeteryId = (`${row[9]}-${row[10]}-${row[hasExtraColumn ? 13 : 12]}`).toLowerCase();
      const veteranId = (`${row[0]}-${row[2]}-${_formatDate(row[4])}-${_formatDate(row[5])}-${cemeteryId}`).toLowerCase();
      // Use transaction
      yield sequelize.transaction(t => co(function* () {
        // Create/Update cemetery
        const cemeteryObj = _removeEmpty({
          cem_id: cemeteryId,
          cem_name: row[9],
          cem_addr_one: row[10],
          cem_addr_two: hasExtraColumn ? null : row[11],
          cem_url: hasExtraColumn ? null : row[15],
          cem_phone: row[hasExtraColumn ? 11 : 15],
          city: row[hasExtraColumn ? 12 : 12],
          state: row[hasExtraColumn ? 12 : 13],
          zip: row[hasExtraColumn ? 15 : 14]
        });
        yield createOrUpdateEntity(Cemetery, { cem_id: cemeteryId }, cemeteryObj, t);

        // Create/Update burial information
        const burialObj = _removeEmpty({
          d_id: veteranId,
          cem_id: cemeteryId,
          section_id: row[6],
          row_num: row[7],
          site_num: row[8]
        });
        yield createOrUpdateEntity(Burial, { d_id: veteranId }, burialObj, t);

        // Create/Update kin
        const kinObj = _removeEmpty({
          v_id: veteranId,
          relationship: row[hasExtraColumn ? 18 : 17],
          v_first_name: row[hasExtraColumn ? 19 : 18],
          v_mid_name: row[hasExtraColumn ? 20 : 19],
          v_last_name: row[hasExtraColumn ? 21 : 20],
          v_suffix: row[hasExtraColumn ? 22 : 21]
        });
        yield createOrUpdateEntity(Kin, { v_id: veteranId }, kinObj, t);


        // Create/Update veteran
        const veteran = yield Veteran.findOne({ where: { d_id: veteranId } });
        const veteranObj = _removeEmpty({
          d_id: veteranId,
          d_first_name: row[0],
          d_mid_name: row[1],
          d_last_name: row[2],
          d_suffix: row[3],
          d_birth_date: _formatDate(row[4]),
          d_death_date: _formatDate(row[5]),
          burial_id: veteranId,
          kin_id: veteranId
        });
        if (!veteran) {
          const newVeteran = yield Veteran.create(veteranObj);
          // Create ranks
          const ranks = [];
          _.each(row[hasExtraColumn ? 24 : 23].split(', '), (v) => {
            if (!_.isEmpty(_.trim(v))) {
              if (_.indexOf(ranks, v) === -1) ranks.push({ value: _.trim(v) });
            }
          });
          const rankIds = yield createOrUpdateLookupEntities(Rank, _.uniqBy(ranks, 'value'), t);
          yield newVeteran.setRanks(rankIds, { transaction: t });

          // Branches
          const branches = [];
          _.each(row[hasExtraColumn ? 23 : 22].split(', '), (v) => {
            if (!_.isEmpty(_.trim(v))) {
              if (_.indexOf(branches, v) === -1) branches.push({ value: _.trim(v) });
            }
          });
          const branchIds = yield createOrUpdateLookupEntities(Branch, _.uniqBy(branches, 'value'), t);
          yield newVeteran.setBranches(branchIds, { transaction: t });

          // Wars
          const wars = [];
          _.each(row[hasExtraColumn ? 25 : 24].split(', '), (v) => {
            if (!_.isEmpty(_.trim(v))) {
              if (_.indexOf(wars, v) === -1) wars.push({ value: _.trim(v) });
            }
          });
          const warIdS = yield createOrUpdateLookupEntities(War, _.uniqBy(wars, 'value'), t);
          yield newVeteran.setWars(warIdS, { transaction: t });
        } else if (!_.isEqual(veteran.toJSON(), veteranObj)) {
          // Lookup data is not updated as it will never change
          _.extend(veteran, veteranObj);
          yield veteran.save({ transaction: t });
        }
      }));
    }

    const processedLines = rowCount - file.length;
    const newProgress = parseInt((100 * processedLines) / rowCount, 10);
    if (newProgress > processingProgress) {
      bar.tick(newProgress - processingProgress);
      processingProgress = newProgress;
    }
    return _.isEmpty(file) ? true : yield processRow();
  }

  yield processRow();
  logger.info(`Imported ${totalCount.veterans} veterans in ${totalCount.branches} branches in ${totalCount.wars} wars.`);
}

/**
 * Helper function that validates that a row has all required information
 * @param {array} - row - The row
 * @param {boolean} - hasExtraColumn - Indicate if the row has extra column
 */
function _validate(row, hasExtraColumn) {
  return (
    !_.isEmpty(_.trim(row[0])) // d_first_name
    && !_.isEmpty(_.trim(row[2])) // d_last_name
    && !_.isEmpty(_.trim(row[4])) // d_birth_date
    && !_.isEmpty(_.trim(row[5])) // d_death_date
    && !_.isEmpty(_.trim(row[5])) // d_death_date
    && !_.isEmpty(_.trim(row[9])) // cem_name
    && !_.isEmpty(_.trim(row[10])) // cem_addr_one
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 13 : 12])) // city
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 18 : 17])) // relationship
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 19 : 18])) // v_first_name
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 21 : 20])) // v_last_name
  );
}

/**
 * Helper function that removes empty attributes from object
 * @param {object} obj - The object
 */
function _removeEmpty(obj) {
  const cleanedObj = {};
  _.each(obj, (value, key) => {
    if (!_.isEmpty(_.trim(value))) {
      cleanedObj[key] = _.trim(value);
    }
  });
  return cleanedObj;
}

/**
 * Parse date.
 * @param {string} d - the string
 */
function _formatDate(d) {
  if (!d || d.length === 0) return null;
  if (!moment(d, 'MM/DD/YYYY').isValid()) return null;
  return moment(d, 'MM/DD/YYYY').format('YYYY-MM-DD'); // Convert to format supported by sequelize
}

module.exports = {
  processFile
};
