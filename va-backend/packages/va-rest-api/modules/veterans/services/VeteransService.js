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
const config = require('config');
const models = require('@va/models');
const logger = require('../../../common/logger');
const { NotFoundError } = require('../../../common/errors');
const helper = require('../../../common/helper');

/**
 * Parse ids string to ids array
 * @param {String} s the string to parse
 */
function parseIds(s) {
  if (!s || s.length === 0) return [];
  return _.map(s.split(','), item => parseInt(item, 10));
}

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const include = [{ model: models.Cemetery, as: 'cemetery' },
    { model: models.War, as: 'wars' },
    { model: models.Rank, as: 'ranks' },
    { model: models.Campaign, as: 'campaigns' },
    { model: models.Branch, as: 'branches' },
    { model: models.File, as: 'profilePicture' }];

  const where = {};
  if (filter.name) {
    where.$or = [{
      firstName: { $like: `%${filter.name}%` }
    }, {
      lastName: { $like: `%${filter.name}%` }
    }, {
      midName: { $like: `%${filter.name}%` }
    }];
  }
  if (filter.birthDateStart) where.birthDate = { $gte: filter.birthDateStart };
  if (filter.birthDateEnd) {
    if (!filter.birthDate) filter.birthDate = {};
    filter.birthDate.$lte = filter.birthDateEnd;
  }
  if (filter.deathDateStart) where.deathDate = { $gte: filter.deathDateStart };
  if (filter.deathDateEnd) {
    if (!filter.deathDate) filter.deathDate = {};
    filter.deathDate.$lte = filter.deathDateEnd;
  }
  if (filter.squadronShip) where.squadronShip = { $like: `%${filter.squadronShip}%` };
  if (filter.branchIds) include[4].where = { id: { $in: parseIds(filter.branchIds) } };
  if (filter.warIds) include[1].where = { id: { $in: parseIds(filter.warIds) } };
  if (filter.cemeteryId) where.cemeteryId = filter.cemeteryId;
  return {
    where,
    include,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]]
  };
}

/**
 * Search veterans
 * @param {object} query the query object
 */
function* search(query) {
  const q = buildDBFilter(query);
  const items = yield models.Veteran.findAll(q);
  // note that when child entities are included for filter, sequelize can not correctly calculate
  // the total count, so the total field is not provided
  return {
    items,
    offset: q.offset,
    limit: q.limit
  };
}

search.schema = {
  query: Joi.object().keys({
    name: Joi.string(),
    birthDateStart: Joi.date(),
    birthDateEnd: Joi.date(),
    deathDateStart: Joi.date(),
    deathDateEnd: Joi.date(),
    squadronShip: Joi.string(),
    branchIds: Joi.string(), // comma separated ids
    warIds: Joi.string(), // comma separated ids
    cemeteryId: Joi.optionalId(),
    limit: Joi.limit(),
    offset: Joi.offset(),
    sortColumn: Joi.string().valid(
      'id', 'firstName', 'lastName', 'midName', 'birthDate', 'deathDate',
      'squadronShip', 'burialLocation'
    ).default('id'),
    sortOrder: Joi.sortOrder()
  })
};

/**
 * Create veteran
 * @param {Array} files - the files
 * @param {object} body - the request body
 */
function* create(files, body) {
  if (body.cemeteryId) {
    yield helper.ensureExists(models.Cemetery, { id: body.cemeteryId });
  }
  if (body.warIds) {
    yield helper.ensureEntitiesExist(models.War, parseIds(body.warIds));
  }
  if (body.rankIds) {
    yield helper.ensureEntitiesExist(models.Rank, parseIds(body.rankIds));
  }
  if (body.campaignIds) {
    yield helper.ensureEntitiesExist(models.Campaign, parseIds(body.campaignIds));
  }
  if (body.branchIds) {
    yield helper.ensureEntitiesExist(models.Branch, parseIds(body.branchIds));
  }

  let veteranId;
  yield models.sequelize.transaction(t => co(function* () {
    // create file
    const file = yield models.File.create({
      name: files[0].filename,
      fileURL: `${config.appURL}/upload/${files[0].filename}`,
      mimeType: files[0].mimetype
    }, { transaction: t });
    // Create veteran
    const veteran = yield models.Veteran.create({
      firstName: body.firstName,
      lastName: body.lastName,
      midName: body.midName,
      birthDate: body.birthDate,
      deathDate: body.deathDate,
      suffix: body.suffix,
      bio: body.bio,
      squadronShip: body.squadronShip,
      burialLocation: body.burialLocation,
      cemeteryId: body.cemeteryId,
      profilePictureId: file.id
    }, { transaction: t });
    // save associations
    if (body.warIds) {
      yield veteran.setWars(parseIds(body.warIds), { transaction: t });
    }
    if (body.rankIds) {
      yield veteran.setRanks(parseIds(body.rankIds), { transaction: t });
    }
    if (body.campaignIds) {
      yield veteran.setCampaigns(parseIds(body.campaignIds), { transaction: t });
    }
    if (body.branchIds) {
      yield veteran.setBranches(parseIds(body.branchIds), { transaction: t });
    }
    veteranId = veteran.id;
  }));

  return yield getSingle(veteranId);
}

create.schema = {
  files: Joi.array().length(1).required(),
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    midName: Joi.string().required(),
    birthDate: Joi.date().required(),
    deathDate: Joi.date().required(),
    suffix: Joi.string(),
    bio: Joi.string().required(),
    squadronShip: Joi.string(),
    burialLocation: Joi.string(),
    cemeteryId: Joi.optionalId(),
    warIds: Joi.string(), // comma separated ids
    rankIds: Joi.string(), // comma separated ids
    campaignIds: Joi.string(), // comma separated ids
    branchIds: Joi.string() // comma separated ids
  }).required()
};

/**
 * Get single veteran
 * @param {Number} id the veteran id
 */
function* getSingle(id) {
  // Get veteran information
  const veteran = yield models.Veteran.findOne({
    where: { id },
    include: [
      {
        model: models.Branch,
        as: 'branches'
      },
      {
        model: models.Rank,
        as: 'ranks'
      },
      {
        model: models.War,
        as: 'wars'
      },
      {
        model: models.Campaign,
        as: 'campaigns'
      },
      {
        model: models.Cemetery,
        as: 'cemetery'
      },
      {
        model: models.File,
        as: 'profilePicture'
      }
    ]
  });
  if (!veteran) throw new NotFoundError(`Veteran with id: ${id} does not exist!`);
  return veteran;
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update veteran
 * @param {Number} id - the veteran id
 * @param {Array} files - the files
 * @param {object} body - the request body
 */
function* update(id, files, body) {
  if (body.cemeteryId) {
    yield helper.ensureExists(models.Cemetery, { id: body.cemeteryId });
  }
  if (body.warIds) {
    yield helper.ensureEntitiesExist(models.War, parseIds(body.warIds));
  }
  if (body.rankIds) {
    yield helper.ensureEntitiesExist(models.Rank, parseIds(body.rankIds));
  }
  if (body.campaignIds) {
    yield helper.ensureEntitiesExist(models.Campaign, parseIds(body.campaignIds));
  }
  if (body.branchIds) {
    yield helper.ensureEntitiesExist(models.Branch, parseIds(body.branchIds));
  }

  // get existing file name to remove
  const existing = yield getSingle(id);
  const filenameToRemove = existing.profilePicture && existing.profilePicture.name;

  yield models.sequelize.transaction(t => co(function* () {
    // create file
    const file = yield models.File.create({
      name: files[0].filename,
      fileURL: `${config.appURL}/upload/${files[0].filename}`,
      mimeType: files[0].mimetype
    }, { transaction: t });
    const veteran = yield helper.ensureExists(models.Veteran, { id });
    // update veteran
    _.assignIn(veteran, {
      firstName: body.firstName,
      lastName: body.lastName,
      midName: body.midName,
      birthDate: body.birthDate,
      deathDate: body.deathDate,
      suffix: body.suffix,
      bio: body.bio,
      squadronShip: body.squadronShip,
      burialLocation: body.burialLocation,
      cemeteryId: body.cemeteryId,
      profilePictureId: file.id
    });
    yield veteran.save({ transaction: t });
    // save associations
    if (body.warIds) {
      yield veteran.setWars(parseIds(body.warIds), { transaction: t });
    }
    if (body.rankIds) {
      yield veteran.setRanks(parseIds(body.rankIds), { transaction: t });
    }
    if (body.campaignIds) {
      yield veteran.setCampaigns(parseIds(body.campaignIds), { transaction: t });
    }
    if (body.branchIds) {
      yield veteran.setBranches(parseIds(body.branchIds), { transaction: t });
    }
  }));

  yield helper.removeFile(filenameToRemove);

  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  files: Joi.array().length(1).required(),
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    midName: Joi.string(),
    birthDate: Joi.date(),
    deathDate: Joi.date(),
    suffix: Joi.string(),
    bio: Joi.string(),
    squadronShip: Joi.string(),
    burialLocation: Joi.string(),
    cemeteryId: Joi.optionalId(),
    warIds: Joi.string(), // comma separated ids
    rankIds: Joi.string(), // comma separated ids
    campaignIds: Joi.string(), // comma separated ids
    branchIds: Joi.string() // comma separated ids
  }).required()
};

/**
 * Remove veteran
 * @param {Number} id - the veteran id
 */
function* remove(id) {
  // get existing file name to remove
  const existing = yield getSingle(id);
  const filenameToRemove = existing.profilePicture && existing.profilePicture.name;

  const veteran = yield helper.ensureExists(models.Veteran, { id });
  const res = yield veteran.destroy();
  yield helper.removeFile(filenameToRemove);
  return res;
}

remove.schema = {
  id: Joi.id()
};

/**
 * Get related veterans
 * @param {Number} id - the veteran id
 * @param {Object} query - the query parameters
 */
function* getRelated(id, query) {
  // return veterans of same branches
  const veteran = yield getSingle(id);
  if (!veteran.branches || veteran.branches.length === 0) {
    return {
      items: [],
      total: 0,
      offset: query.offset,
      limit: query.limit
    };
  }
  query.sortColumn = 'id';
  query.sortOrder = 'asc';
  query.branchIds = _.map(veteran.branches, b => b.id).join(',');
  return yield search(query);
}

getRelated.schema = {
  id: Joi.id(),
  query: Joi.object().keys({
    limit: Joi.limit(),
    offset: Joi.offset()
  })
};

module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  getRelated
};

logger.buildService(module.exports);
