'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Data service.
 */
const _ = require('lodash');
const fs = require('fs');
const md5 = require('md5');
const csv = require('csv-parse/lib/sync');
const moment = require('moment');
const { csvHeaders } = require('../constants');
const logger = require('../common/logger');
const {
  Veteran,
  Burial,
  Cemetery,
  Kin,
  Rank,
  Branch,
  War
} = require('@va/models');

const OPTION_IGNORE_BAD_CSV_LINE = process.env.OPTION_IGNORE_BAD_CSV_LINE === 'true';
const OPTION_IMPORT_EXTRA_DATA = process.env.OPTION_IMPORT_EXTRA_DATA === 'true';

if (OPTION_IGNORE_BAD_CSV_LINE) {
  logger.info('Will ignore bad csv lines');
}

if (OPTION_IMPORT_EXTRA_DATA) {
  logger.info('Will try to import extra data');
}

/**
 * Count number of lines in file
 */
function countFileLines(filePath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let i = 0;
    fs.createReadStream(filePath)
      .on('data', (buffer) => {
        for (i = 0; i < buffer.length; i += 1) {
          if (buffer[i] === 10) lineCount += 1;
        }
      }).on('close', () => {
        resolve(lineCount);
      }).on('error', reject);
  });
}

/**
 * Process file line
 * @param {string} line - The input file line
 */
function* processLine(line, transaction) {
  /**
   * Create or update entity
   * @param {Sequelize model} Model - The sequelize model
   * @param {object} where - The where clause
   * @param {object} data - The entity data
   * @param {sequelize transaction} t - The sequelize transaction
   * @returns {array} Array with IDs
   */
  function* createOrUpdateEntity(Model, where, data, t) {
    let entity = yield Model.findOne({ where, transaction: t });
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
      const name = items[i].name.trim();
      if (name.length > 0) {
        const entity = yield createOrUpdateEntity(Model, { name }, { name }, t);
        if (_.indexOf(ids, entity.id) < 0) {
          ids.push(entity.id);
        }
      }
    }
    return ids;
  }

  /**
    * Process a row
    * @param {string} lineRow the line
    */
  function* processRow(lineRow, t) {
    const row = _getCleanRow(lineRow);
    if (row === null) {
      return false;
    }

    // Dataset for foreign addresses has an extra column so we need to skip it
    const hasExtraColumn = row.length - 1 > csvHeaders.length;
    // ignore header & rows with missing attributes
    if (_.intersection(row, csvHeaders).length < csvHeaders.length && _validateRequired(row, hasExtraColumn)
        && (OPTION_IMPORT_EXTRA_DATA || _validate(row))) {
      const cemeteryId = (`${row[9]} - ${row[10]} - ${row[12]} - ${row[13]}`).toLowerCase();
      const veteranId = (_validate(row))
        ? (`${row[0]} - ${row[2]} - ${_formatDate(row[4])} - ${_formatDate(row[5])} - ${cemeteryId}`).toLowerCase()
        : (`${row[0]} - ${row[2]} - ${md5(line)} - ${cemeteryId}`).toLowerCase();
      // Create/Update cemetery
      const cemeteryObj = _removeEmpty({
        name: row[9],
        addrOne: row[10],
        addrTwo: row[11],
        url: hasExtraColumn ? row[16] : row[15],
        phone: row[hasExtraColumn ? 17 : 16],
        city: row[12],
        state: row[13],
        zip: row[hasExtraColumn ? 15 : 14]
      });
      const cemeteryEntity = yield createOrUpdateEntity(Cemetery, {
        name: cemeteryObj.name,
        addrOne: cemeteryObj.addrOne,
        city: cemeteryObj.city,
        state: cemeteryObj.state
      }, cemeteryObj, t);

      // Create/Update burial information
      const burialObj = {
        sectionId: row[6],
        rowNum: row[7],
        siteNum: row[8],
        cemeteryId: cemeteryEntity.id
      };
      const burialEntity = yield createOrUpdateEntity(Burial, burialObj, burialObj, t);

      // Create/Update kin
      const kinObj = {
        relationship: row[hasExtraColumn ? 18 : 17],
        firstName: row[hasExtraColumn ? 19 : 18],
        midName: row[hasExtraColumn ? 20 : 19],
        lastName: row[hasExtraColumn ? 21 : 20],
        suffix: row[hasExtraColumn ? 22 : 21]
      };
      const kinEntity = yield createOrUpdateEntity(Kin, kinObj, kinObj, t);

      // Create/Update veteran
      let veteran = yield Veteran.findOne({ where: { veteranId }, transaction: t });
      const veteranObj = _removeEmpty({
        firstName: row[0],
        lastName: row[2],
        midName: row[1],
        birthDate: _formatDate(row[4]),
        deathDate: _formatDate(row[5]),
        suffix: row[3],
        burialLocation: `sectionId: ${burialObj.sectionId}, rowNum: ${burialObj.rowNum}, siteNum: ${burialObj.siteNum}`,
        veteranId,
        cemeteryId: cemeteryEntity.id,
        kinId: kinEntity.id,
        burialId: burialEntity.id
      });
      if (veteranObj.birthDate) {
        veteranObj.birthDate = new Date(veteranObj.birthDate);
      }
      if (veteranObj.deathDate) {
        veteranObj.deathDate = new Date(veteranObj.deathDate);
      }
      let result;
      if (!veteran) {
        veteran = yield Veteran.create(veteranObj, { transaction: t });
        result = true;
      } else {
        _.extend(veteran, veteranObj);
        yield veteran.save({ transaction: t });
        result = false;
      }

      // Create ranks
      const ranks = [];
      _.each(row[hasExtraColumn ? 24 : 23].split(', '), (v) => {
        if (!_.isEmpty(_.trim(v))) {
          ranks.push({ name: _.trim(v) });
        }
      });
      const rankIds = yield createOrUpdateLookupEntities(Rank, _.uniqBy(ranks, 'name'), t);
      yield veteran.setRanks(rankIds, { transaction: t });

      // Branches
      const branches = [];
      _.each(row[hasExtraColumn ? 23 : 22].split(', '), (v) => {
        if (!_.isEmpty(_.trim(v))) {
          branches.push({ name: _.trim(v) });
        }
      });
      const branchIds = yield createOrUpdateLookupEntities(Branch, _.uniqBy(branches, 'name'), t);
      yield veteran.setBranches(branchIds, { transaction: t });

      // Wars
      const wars = [];
      _.each(row[hasExtraColumn ? 25 : 24].split(', '), (v) => {
        if (!_.isEmpty(_.trim(v))) {
          wars.push({ name: _.trim(v) });
        }
      });
      const warIds = yield createOrUpdateLookupEntities(War, _.uniqBy(wars, 'name'), t);
      yield veteran.setWars(warIds, { transaction: t });

      return result;
    }

    return false;
  }

  return yield processRow(line, transaction);
}

/**
 * Convert line to CSV array.
 *
 * Will try to recover some dirty csv lines when OPTION_IGNORE_BAD_CSV_LINE is set to true.
 * (ex: "Name", ""M"", "Last". or: "Name", ""E" Middle", "Last").
 *
 * @param {string} line The line
 * @return {Array} The cleaned line cells. Throw error if not possible
 */
function _getCleanRow(line) {
  let row = null;
  try {
    row = csv(line).shift();
  } catch (err1) {
    if (!OPTION_IGNORE_BAD_CSV_LINE) {
      logger.error('Failed to recover CSV line');
      throw err1;
    }
    logger.warn('Dirty CSV line. Trying to recover');
    try {
      row = csv(line.replace(/"("[^",]*")"|("[^",]*")"(?=,)|"("[^",]*")|\s("[^",]*")\s/g, (match, g1, g2, g3, g4) => {
        if (g1) {
          return g1;
        } else if (g2) {
          return g2.replace(/"/g, '') + '"';
        } else if (g3) {
          return '"' + g3.replace(/"/g, '');
        }
        return g4.replace(/"/g, '');
      })).shift();
    } catch (err2) {
      logger.error('Failed to recover CSV line');
    }
  }
  return row;
}

/**
 * Helper function that validates really required data.
 * @param {array} - row - The row
 * @param {boolean} - hasExtraColumn - Indicate if the row has extra column
 */
function _validateRequired(row, hasExtraColumn) {
  if (OPTION_IMPORT_EXTRA_DATA) {
    // add relationship
    if (_.isEmpty(_.trim(row[hasExtraColumn ? 18 : 17])) && !_.isEmpty(_.trim(row[0]))) {
      if (_.trim(row[0]) === _.trim(row[hasExtraColumn ? 19 : 18])
          && _.trim(row[1]) === _.trim(row[hasExtraColumn ? 20 : 19])
          && _.trim(row[2]) === _.trim(row[hasExtraColumn ? 21 : 20])) { // self
        row[hasExtraColumn ? 18 : 17] = 'Veteran (Self)';
      } else if (_.trim(row[2]) === _.trim(row[hasExtraColumn ? 21 : 20])) { // same last name
        row[hasExtraColumn ? 18 : 17] = 'Other Relative';
      }
    }

    // copy name to v_name
    if (_.trim(row[hasExtraColumn ? 18 : 17]).toLowerCase() === 'Veteran (Self)'.toLowerCase() && !_.isEmpty(_.trim(row[0]))
        && (_.isEmpty(_.trim(row[hasExtraColumn ? 19 : 18])) || _.isEmpty(_.trim(row[hasExtraColumn ? 21 : 20])))) {
      [row[hasExtraColumn ? 19 : 18], row[hasExtraColumn ? 20 : 19], row[hasExtraColumn ? 21 : 20]] = [row[0], row[1], row[2]];
    }
  }

  return (
    !_.isEmpty(_.trim(row[0])) // d_first_name
    && !_.isEmpty(_.trim(row[2])) // d_last_name
    && !_.isEmpty(_.trim(row[9])) // cem_name
    && !_.isEmpty(_.trim(row[10])) // cem_addr_one
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 13 : 12])) // city
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 18 : 17])) // relationship
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 19 : 18])) // v_first_name
    && !_.isEmpty(_.trim(row[hasExtraColumn ? 21 : 20])) // v_last_name
  );
}

/**
 * Helper function that validates optional data when OPTION_IMPORT_EXTRA_DATA is set to true.
 * @param {Array} - row - The row
 */
function _validate(row) {
  return (
    !_.isEmpty(_.trim(row[4])) // d_birth_date
    && !_.isEmpty(_.trim(row[5])) // d_death_date
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
 * Format date.
 * @param {string} d - the string
 */
function _formatDate(d) {
  if (!d || d.length === 0) return null;
  if (!moment(d, 'MM/DD/YYYY').isValid()) return null;
  return moment(d, 'MM/DD/YYYY').format('YYYY-MM-DD');
}

module.exports = {
  countFileLines,
  processLine
};
