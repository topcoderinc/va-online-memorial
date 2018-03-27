'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Badge service
 */
const Joi = require('joi');
const _ = require('lodash');
const models = require('@va/models');
const logger = require('../../../common/logger');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../../../common/errors');
const helper = require('../../../common/helper');

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const include = [{ model: models.Veteran, as: 'veteran' }, { model: models.BadgeType, as: 'badgeType' }];

  const where = {};
  if (filter.veteranId) where.veteranId = filter.veteranId;
  if (filter.userId) where.createdBy = filter.userId;
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
 * Search badges
 * @param {object} query the query object
 * @param {object} user the current user
 */
function* search(query, user) {
  // if user is not manager of veteran, then only approved records can be shown
  if (query.veteranId && !(yield helper.canManageVeteran(user, query.veteranId))) {
    if (!query.status) {
      query.status = models.modelConstants.Statuses.Approved;
    } else if (query.status !== models.modelConstants.Statuses.Approved) {
      throw new BadRequestError('User can search only approved veteran content.');
    }
  }

  const q = buildDBFilter(query);
  const docs = yield models.Badge.findAndCountAll(q);
  return {
    items: yield helper.populateUsersForEntities(docs.rows),
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
    sortColumn: Joi.string().valid('id', 'veteranId', 'badgeTypeId', 'status').default('id'),
    sortOrder: Joi.sortOrder()
  }),
  user: Joi.object().required()
};

/**
 * Create badge
 * @param {object} body - the request body
 */
function* create(body) {
  yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  yield helper.ensureExists(models.BadgeType, { id: body.badgeTypeId });

  const badge = yield models.Badge.create(body);
  return yield getSingle(badge.id);
}

create.schema = {
  body: Joi.object().keys({
    veteranId: Joi.id(),
    badgeTypeId: Joi.id(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)).required(),
    createdBy: Joi.id()
  }).required()
};

/**
 * Get single badge
 * @param {Number} id the id
 */
function* getSingle(id) {
  const badge = yield models.Badge.findOne({
    where: { id },
    include: [
      {
        model: models.Veteran,
        as: 'veteran'
      },
      {
        model: models.BadgeType,
        as: 'badgeType'
      }
    ]
  });
  if (!badge) throw new NotFoundError(`Badge with id: ${id} does not exist!`);
  return yield helper.populateUsersForEntity(badge);
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update badge
 * @param {Number} id - the id
 * @param {object} body - the request body
 */
function* update(id, body) {
  if (body.veteranId) {
    yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  }
  if (body.badgeTypeId) {
    yield helper.ensureExists(models.BadgeType, { id: body.badgeTypeId });
  }

  const badge = yield helper.ensureExists(models.Badge, { id });
  _.assignIn(badge, body);
  yield badge.save();
  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    veteranId: Joi.optionalId(),
    badgeTypeId: Joi.optionalId(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)),
    createdBy: Joi.optionalId(),
    updatedBy: Joi.id()
  }).required()
};

/**
 * Remove badge
 * @param {Number} id - the id
 */
function* remove(id) {
  const badge = yield helper.ensureExists(models.Badge, { id });
  return yield badge.destroy();
}

remove.schema = {
  id: Joi.id()
};

/**
 * Approve badge
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* approve(id, user) {
  const badge = yield helper.ensureExists(models.Badge, { id });
  if (!(yield helper.canManageVeteran(user, badge.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  badge.status = models.modelConstants.Statuses.Approved;
  badge.updatedBy = user.id;
  yield badge.save();
}

approve.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Reject badge
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* reject(id, user) {
  const badge = yield helper.ensureExists(models.Badge, { id });
  if (!(yield helper.canManageVeteran(user, badge.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  badge.status = models.modelConstants.Statuses.Rejected;
  badge.updatedBy = user.id;
  yield badge.save();
}

reject.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Salute badge
 * @param {Number} id - the badge id
 * @param {Number} userId - the current user id
 */
function* salute(id, userId) {
  yield helper.ensureExists(models.Badge, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Badge,
      postId: id
    }
  });
  if (!s) {
    yield models.PostSalute.create({
      userId,
      postType: models.modelConstants.PostTypes.Badge,
      postId: id
    });
  }
}

salute.schema = {
  id: Joi.id(),
  userId: Joi.id()
};

/**
 * Check whether user saluted the badge
 * @param {Number} id - the badge id
 * @param {Number} userId - the current user id
 */
function* isSaluted(id, userId) {
  yield helper.ensureExists(models.Badge, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Badge,
      postId: id
    }
  });
  return { saluted: !!s };
}

isSaluted.schema = {
  id: Joi.id(),
  userId: Joi.id()
};

/**
 * Share badge
 * @param {Number} id - the badge id
 * @param {Number} userId - the current user id
 */
function* share(id, userId) { // eslint-disable-line no-unused-vars
  yield helper.ensureExists(models.Badge, { id });
  // it should increase the share count,
  // but statistics is out of scope, so it does nothing at present
}

share.schema = {
  id: Joi.id(),
  userId: Joi.id()
};


module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  approve,
  reject,
  salute,
  isSaluted,
  share
};

logger.buildService(module.exports);
