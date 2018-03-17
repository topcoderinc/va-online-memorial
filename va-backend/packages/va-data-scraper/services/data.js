'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Data
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
 * Process file
 * @param {array} file - The input file
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
    * @param {string} line the line
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
      const cemeteryId = (`${row[9]}-${row[10]}-${row[hasExtraColumn ? 13 : 12]}`).toLowerCase();
      const veteranId = (_validate(row))
        ? (`${row[0]}-${row[2]}-${_formatDate(row[4])}-${_formatDate(row[5])}-${cemeteryId}`).toLowerCase()
        : (`${row[0]}-${row[2]}-${md5(line)}-${cemeteryId}`).toLowerCase();
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
      const veteran = yield Veteran.findOne({ where: { d_id: veteranId }, transaction: t });
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
        const newVeteran = yield Veteran.create(veteranObj, { transaction: t });
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

        return true;
      } else if (!_.isEqual(veteran.toJSON(), veteranObj)) {
        // Lookup data is not updated as it will never change
        _.extend(veteran, veteranObj);
        yield veteran.save({ transaction: t });
      }
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
 * @return {string} The cleaned line. Throw error if not possible
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
 * @param {string} - row - The row
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
 * @param {string} - row - The row
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
 * Parse date.
 * @param {string} d - the string
 */
function _formatDate(d) {
  if (!d || d.length === 0) return moment('01/01/1800', 'MM/DD/YYYY').format('YYYY-MM-DD');
  if (!moment(d, 'MM/DD/YYYY').isValid()) return null;
  return moment(d, 'MM/DD/YYYY').format('YYYY-MM-DD'); // Convert to format supported by sequelize
}

module.exports = {
  countFileLines,
  processLine
};
