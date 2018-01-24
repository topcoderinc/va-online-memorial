'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Veterans service
 */
const Joi = require('joi');
const _ = require('lodash');
const co = require('co');
const {
  Branch,
  Rank,
  War,
  Cemetery,
  Burial,
  Kin,
  Veteran,
  sequelize
} = require('@va/models');
const logger = require('../../../common/logger');
const { ConflictError, NotFoundError } = require('../../../common/errors');
const { DefaultPagination } = require('../../../constants');
const {
  formatDate,
  createOrUpdateLookupEntities,
  createOrUpdateEntity
} = require('../helper');

/**
 * Create
 * @param {object} veteran - the veteran details
 */
function* create(veteran) {
  // Format dates
  veteran.d_birth_date = formatDate(veteran.d_birth_date);
  veteran.d_death_date = formatDate(veteran.d_death_date);

  const cemeteryId = [
    veteran.burial.cemetery.cem_name,
    veteran.burial.cemetery.cem_addr_one,
    veteran.burial.cemetery.city
  ].join('-').toLowerCase();

  const veteranId = [
    veteran.d_first_name,
    veteran.d_last_name,
    veteran.d_birth_date,
    veteran.d_death_date,
    veteran.d_last_name,
    cemeteryId
  ].join('-').toLowerCase();

  const existing = yield Veteran.findById(veteranId);
  if (existing) throw new ConflictError('Veteran already exists!');

  const cemeteryObj = {
    ..._.pick(veteran.burial.cemetery, [
      'cem_name',
      'cem_addr_one',
      'cem_addr_two',
      'cem_url',
      'cem_phone',
      'city',
      'state',
      'zip'
    ]),
    cem_id: cemeteryId
  };

  const burialObj = {
    ..._.pick(veteran.burial, ['section_id', 'row_num', 'site_num']),
    d_id: veteranId,
    cem_id: cemeteryId
  };

  const kinObj = {
    ...veteran.kin,
    v_id: veteranId
  };

  const veteranObj = _.pick(veteran, [
    'd_first_name',
    'd_mid_name',
    'd_last_name',
    'd_suffix',
    'd_birth_date',
    'd_death_date'
  ]);

  yield sequelize.transaction(t => co(function* () {
    // Create or update cemetery
    yield createOrUpdateEntity(Cemetery, { cem_id: cemeteryId }, cemeteryObj, t);
    // Create or update burial
    yield createOrUpdateEntity(Burial, { d_id: veteranId }, burialObj, t);
    // Create or update kin
    yield createOrUpdateEntity(Kin, { v_id: veteranId }, kinObj, t);
    // Create veteran
    const newVeteran = yield Veteran.create({
      ...veteranObj,
      d_id: veteranId,
      burial_id: veteranId,
      kin_id: veteranId
    }, { transaction: t });

    // Create ranks
    const rankIds = yield createOrUpdateLookupEntities(Rank, _.uniq(veteran.ranks), t);
    yield newVeteran.setRanks(rankIds, { transaction: t });

    // Branches
    const branchIds = yield createOrUpdateLookupEntities(Branch, _.uniq(veteran.branches), t);
    yield newVeteran.setBranches(branchIds, { transaction: t });

    // Wars
    const warIdS = yield createOrUpdateLookupEntities(War, _.uniq(veteran.wars), t);
    yield newVeteran.setWars(warIdS, { transaction: t });
  }));

  return yield getSingle(veteranId);
}

create.schema = {
  veteran: Joi.object().keys({
    d_first_name: Joi.string().required(),
    d_mid_name: Joi.string(),
    d_last_name: Joi.string().required(),
    d_birth_date: Joi.date().required(),
    d_death_date: Joi.date().required(),
    d_suffix: Joi.string(),
    // Burial information
    burial: Joi.object({
      section_id: Joi.string(),
      row_num: Joi.string(),
      site_num: Joi.string(),
      // Cemetery information
      cemetery: Joi.object({
        cem_name: Joi.string().required(),
        cem_addr_one: Joi.string().required(),
        cem_addr_two: Joi.string(),
        cem_url: Joi.string().uri(),
        cem_phone: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string()
      }).required()
    }).required(),
    // Lookups
    branches: Joi.array().items(Joi.string()),
    wars: Joi.array().items(Joi.string()),
    ranks: Joi.array().items(Joi.string()),
    // Kin information
    kin: Joi.object({
      relationship: Joi.string().required(),
      v_first_name: Joi.string().required(),
      v_mid_name: Joi.string(),
      v_last_name: Joi.string().required(),
      v_suffix: Joi.string()
    }).required()
  }).required()
};

/**
 * Get all
 * @param {object} filters - the pagination filters
 */
function* getAll(filters) {
  _.defaults(filters, DefaultPagination);
  const count = yield Veteran.count();
  const items = yield Veteran.findAll({ ...filters });
  return {
    ...filters,
    count,
    items
  };
}

getAll.schema = {
  filters: Joi.object().keys({
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0)
  })
};

/**
 * Get single
 * @param {string} d_id - the veteran ID
 */
function* getSingle(d_id) {
  // Get veteran information
  const veteran = yield Veteran.findOne({
    where: { d_id },
    include: [
      {
        model: Branch,
        as: 'branches'
      },
      {
        model: Rank,
        as: 'ranks'
      },
      {
        model: War,
        as: 'wars'
      }
    ]
  });
  if (!veteran) throw new NotFoundError(`Veteran with d_id: ${d_id} does not exist!`);
  // Get burial information
  const burial = yield Burial.findOne({
    where: { d_id },
    include: [
      {
        model: Cemetery,
        as: 'cemetery'
      }
    ]
  });
  // Get kin
  const kin = yield Kin.findById(d_id);
  return {
    ...veteran.toJSON(),
    burial,
    kin
  };
}

getSingle.schema = {
  d_id: Joi.string().required()
};

/**
 * Update veteran
 * @param {string} d_id - the veteran ID
 * @param {object} updated - the updated veteran data
 */
function* update(d_id, updated) {
  const veteran = yield Veteran.findById(d_id);
  if (!veteran) throw new NotFoundError(`Veteran with d_id: ${d_id} does not exist!`);

  _.extend(veteran, _.pick(updated, [
    'd_mid_name',
    'd_suffix'
  ]));

  yield sequelize.transaction(t => co(function* () {
    yield veteran.save({ transaction: t });

    if (updated.burial) {
      // Create or update burial
      const burialObj = _.pick(updated.burial, ['section_id', 'row_num', 'site_num']);
      const burial = yield createOrUpdateEntity(Burial, { d_id }, burialObj, t);
      const cem = yield burial.getCemetery();
      if (updated.burial.cemetery) {
        // Create or update cemetery
        const cemeteryObj = _.pick(updated.burial.cemetery, ['cem_url', 'cem_phone']);
        yield createOrUpdateEntity(Cemetery, { cem_id: cem.cem_id }, cemeteryObj, t);
      }
    }
    if (updated.kin) {
      // Create or update kin
      yield createOrUpdateEntity(Kin, { v_id: d_id }, updated.kin, t);
    }
  }));
  return yield getSingle(d_id);
}

update.schema = {
  d_id: Joi.string().required(),
  updated: Joi.object().keys({
    d_mid_name: Joi.string(),
    d_suffix: Joi.string(),
    // Burial information
    burial: Joi.object({
      section_id: Joi.string(),
      row_num: Joi.string(),
      site_num: Joi.string(),
      // Cemetery information
      cemetery: Joi.object({
        cem_url: Joi.string().uri(),
        cem_phone: Joi.string()
      })
    }),
    // Kin information
    kin: Joi.object({
      relationship: Joi.string(),
      v_first_name: Joi.string(),
      v_mid_name: Joi.string(),
      v_last_name: Joi.string(),
      v_suffix: Joi.string()
    })
  }).required()
};

/**
 * Remove veteran
 * @param {string} d_id - the veteran ID
 */
function* remove(d_id) {
  const veteran = yield Veteran.findById(d_id);
  if (!veteran) throw new NotFoundError(`Veteran with d_id: ${d_id} does not exist!`);
  yield Burial.destroy({ where: { d_id } });
  yield Kin.destroy({ where: { v_id: d_id } });
  return yield veteran.destroy();
}

remove.schema = {
  d_id: Joi.string().required()
};

module.exports = {
  create,
  getAll,
  getSingle,
  update,
  remove
};

logger.buildService(module.exports);
