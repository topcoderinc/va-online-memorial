'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Next of kins service
 */
const Joi = require('joi');
const _ = require('lodash');
const co = require('co');
const config = require('config');
const models = require('@va/models');
const logger = require('../../../common/logger');
const { NotFoundError } = require('../../../common/errors');
const helper = require('../../../common/helper');
const securityHelper = require('../../security/helper');

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const include = [{ model: models.User, as: 'user' },
    { model: models.Veteran, as: 'veteran' },
    { model: models.File, as: 'proofs' }];

  const where = {};
  if (filter.veteranId) where.veteranId = filter.veteranId;
  if (filter.userId) where.userId = filter.userId;
  if (filter.status) where.status = filter.status;
  return {
    where,
    include,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]]
  };
}

/**
 * Search next of kins
 * @param {object} query the query object
 */
function* search(query) {
  const q = buildDBFilter(query);
  const docs = yield models.NextOfKin.findAndCountAll(q);
  const entities = yield helper.populateUsersForEntities(docs.rows);
  const items = _.map(entities, (e) => {
    e.user = securityHelper.convertUser(e.user);
    return e;
  });
  return {
    items,
    total: docs.count,
    offset: q.offset,
    limit: q.limit
  };
}

search.schema = {
  query: Joi.object().keys({
    veteranId: Joi.optionalId(),
    userId: Joi.optionalId(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)),
    limit: Joi.limit(),
    offset: Joi.offset(),
    sortColumn: Joi.string().valid('id', 'userId', 'veteranId', 'fullName', 'email', 'status').default('id'),
    sortOrder: Joi.sortOrder()
  })
};

/**
 * Create next of kin
 * @param {Array} files - the files
 * @param {object} body - the request body
 */
function* create(files, body) {
  yield helper.ensureExists(models.User, { id: body.userId });
  yield helper.ensureExists(models.Veteran, { id: body.veteranId });

  let theId;
  yield models.sequelize.transaction(t => co(function* () {
    // create proof files
    const fileIds = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = yield models.File.create({
        name: files[i].filename,
        fileURL: `${config.appURL}/upload/${files[i].filename}`,
        mimeType: files[i].mimetype
      }, { transaction: t });
      fileIds.push(file.id);
    }
    // Create next of kin
    const kin = yield models.NextOfKin.create(body, { transaction: t });
    // save associations
    yield kin.setProofs(fileIds, { transaction: t });
    theId = kin.id;
  }));

  return yield getSingle(theId);
}

create.schema = {
  files: Joi.array().min(1).required(),
  body: Joi.object().keys({
    userId: Joi.id(),
    veteranId: Joi.id(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)).required(),
    response: Joi.string(),
    createdBy: Joi.id()
  }).required()
};

/**
 * Get single next of kin
 * @param {Number} id the id
 */
function* getSingle(id) {
  const kin = yield models.NextOfKin.findOne({
    where: { id },
    include: [
      {
        model: models.User,
        as: 'user'
      },
      {
        model: models.Veteran,
        as: 'veteran'
      },
      {
        model: models.File,
        as: 'proofs'
      }
    ]
  });
  if (!kin) throw new NotFoundError(`Next of kin with id: ${id} does not exist!`);
  const k = yield helper.populateUsersForEntity(kin);
  k.user = securityHelper.convertUser(k.user);
  return k;
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update next of kin
 * @param {Number} id - the id
 * @param {Array} files - the files
 * @param {object} body - the request body
 */
function* update(id, files, body) {
  if (body.userId) {
    yield helper.ensureExists(models.User, { id: body.userId });
  }
  if (body.veteranId) {
    yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  }

  // get existing file names to remove
  const existing = yield getSingle(id);
  const filenamesToRemove = _.map(existing.proofs || [], p => p.name);

  yield models.sequelize.transaction(t => co(function* () {
    // create proof files
    const fileIds = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = yield models.File.create({
        name: files[i].filename,
        fileURL: `${config.appURL}/upload/${files[i].filename}`,
        mimeType: files[i].mimetype
      }, { transaction: t });
      fileIds.push(file.id);
    }
    // update next of kin
    const kin = yield helper.ensureExists(models.NextOfKin, { id });
    _.assignIn(kin, body);
    yield kin.save({ transaction: t });
    // save associations
    yield kin.setProofs(fileIds, { transaction: t });
  }));

  // remove previous files
  yield helper.removeFiles(filenamesToRemove);

  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  files: Joi.array().min(1).required(),
  body: Joi.object().keys({
    userId: Joi.optionalId(),
    veteranId: Joi.optionalId(),
    fullName: Joi.string(),
    email: Joi.string().email(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)),
    response: Joi.string(),
    createdBy: Joi.optionalId(),
    updatedBy: Joi.id()
  }).required()
};

/**
 * Remove next of kin
 * @param {Number} id - the id
 */
function* remove(id) {
  // get existing file names to remove
  const existing = yield getSingle(id);
  const filenamesToRemove = _.map(existing.proofs || [], p => p.name);

  const kin = yield helper.ensureExists(models.NextOfKin, { id });
  const res = yield kin.destroy();

  // remove files
  yield helper.removeFiles(filenamesToRemove);
  return res;
}

remove.schema = {
  id: Joi.id()
};

/**
 * Approve next of kin
 * @param {Number} id - the id
 * @param {Number} userId - the current user id
 */
function* approve(id, userId) {
  const kin = yield helper.ensureExists(models.NextOfKin, { id });
  kin.status = models.modelConstants.Statuses.Approved;
  kin.updatedBy = userId;
  yield kin.save();
}

approve.schema = {
  id: Joi.id(),
  userId: Joi.id()
};

/**
 * Reject next of kin
 * @param {Number} id - the id
 * @param {object} body - the request body
 * @param {Number} userId - the current user id
 */
function* reject(id, body, userId) {
  const kin = yield helper.ensureExists(models.NextOfKin, { id });
  kin.status = models.modelConstants.Statuses.Rejected;
  kin.response = body.response;
  kin.updatedBy = userId;
  yield kin.save();
}

reject.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    response: Joi.string().required()
  }).required(),
  userId: Joi.id()
};


module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  approve,
  reject
};

logger.buildService(module.exports);
