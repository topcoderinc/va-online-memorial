'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Story service
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
  const include = [{ model: models.Veteran, as: 'veteran' }];

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
 * Search stories
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
  const docs = yield models.Story.findAndCountAll(q);
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
    sortColumn: Joi.string().valid('id', 'veteranId', 'title', 'text', 'status').default('id'),
    sortOrder: Joi.sortOrder()
  }),
  user: Joi.object().required()
};

/**
 * Create story
 * @param {object} body - the request body
 */
function* create(body) {
  yield helper.ensureExists(models.Veteran, { id: body.veteranId });

  const story = yield models.Story.create(body);
  return yield getSingle(story.id);
}

create.schema = {
  body: Joi.object().keys({
    veteranId: Joi.id(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)).required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    createdBy: Joi.id()
  }).required()
};

/**
 * Get single story
 * @param {Number} id the id
 */
function* getSingle(id) {
  const story = yield models.Story.findOne({
    where: { id },
    include: [
      {
        model: models.Veteran,
        as: 'veteran'
      }
    ]
  });
  if (!story) throw new NotFoundError(`Story with id: ${id} does not exist!`);
  return yield helper.populateUsersForEntity(story);
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update story
 * @param {Number} id - the id
 * @param {object} body - the request body
 */
function* update(id, body) {
  if (body.veteranId) {
    yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  }

  const story = yield helper.ensureExists(models.Story, { id });
  _.assignIn(story, body);
  yield story.save();
  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    veteranId: Joi.optionalId(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)),
    title: Joi.string(),
    text: Joi.string(),
    createdBy: Joi.optionalId(),
    updatedBy: Joi.id()
  }).required()
};

/**
 * Remove story
 * @param {Number} id - the id
 */
function* remove(id) {
  const story = yield helper.ensureExists(models.Story, { id });
  return yield story.destroy();
}

remove.schema = {
  id: Joi.id()
};

/**
 * Approve story
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* approve(id, user) {
  const story = yield helper.ensureExists(models.Story, { id });
  if (!(yield helper.canManageVeteran(user, story.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  story.status = models.modelConstants.Statuses.Approved;
  story.updatedBy = user.id;
  yield story.save();
}

approve.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Reject story
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* reject(id, user) {
  const story = yield helper.ensureExists(models.Story, { id });
  if (!(yield helper.canManageVeteran(user, story.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  story.status = models.modelConstants.Statuses.Rejected;
  story.updatedBy = user.id;
  yield story.save();
}

reject.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Salute story
 * @param {Number} id - the story id
 * @param {Number} userId - the current user id
 */
function* salute(id, userId) {
  yield helper.ensureExists(models.Story, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Story,
      postId: id
    }
  });
  if (!s) {
    yield models.PostSalute.create({
      userId,
      postType: models.modelConstants.PostTypes.Story,
      postId: id
    });
  }
}

salute.schema = {
  id: Joi.id(),
  userId: Joi.id()
};

/**
 * Check whether user saluted the story
 * @param {Number} id - the story id
 * @param {Number} userId - the current user id
 */
function* isSaluted(id, userId) {
  yield helper.ensureExists(models.Story, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Story,
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
 * Share story
 * @param {Number} id - the story id
 * @param {Number} userId - the current user id
 */
function* share(id, userId) { // eslint-disable-line no-unused-vars
  yield helper.ensureExists(models.Story, { id });
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
