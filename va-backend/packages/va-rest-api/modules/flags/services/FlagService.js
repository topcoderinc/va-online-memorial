'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Flag service
 */
const Joi = require('joi');
const _ = require('lodash');
const models = require('@va/models');
const logger = require('../../../common/logger');
const helper = require('../../../common/helper');

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const where = {};
  if (filter.userId) where.createdBy = filter.userId;
  if (filter.postType) where.postType = filter.postType;
  if (filter.status) where.status = filter.status;
  return {
    where,
    offset: filter.offset,
    limit: filter.limit,
    order: [[filter.sortColumn, filter.sortOrder.toUpperCase()]]
  };
}

/**
 * Search flags
 * @param {object} query the query object
 */
function* search(query) {
  const q = buildDBFilter(query);
  const docs = yield models.Flag.findAndCountAll(q);
  const items = yield helper.populateUsersForEntities(docs.rows);
  for (let i = 0; i < items.length; i += 1) {
    items[i] = yield populatePost(items[i]);
  }
  return {
    items,
    total: docs.count,
    offset: q.offset,
    limit: q.limit
  };
}

search.schema = {
  query: Joi.object().keys({
    userId: Joi.optionalId(),
    postType: Joi.string().valid(_.values(models.modelConstants.PostTypes)),
    status: Joi.string().valid(_.values(models.modelConstants.FlagStatuses)),
    limit: Joi.limit(),
    offset: Joi.offset(),
    sortColumn: Joi.string().valid('id', 'postId', 'postType', 'status', 'reason').default('id'),
    sortOrder: Joi.sortOrder()
  })
};

/**
 * Validate post
 * @param {Number} postId - the post id
 * @param {String} postType - the post type
 */
function* validatePost(postId, postType) {
  if (!postId || !postType) return;
  if (postType === models.modelConstants.PostTypes.Story) {
    yield helper.ensureExists(models.Story, { id: postId });
  } else if (postType === models.modelConstants.PostTypes.Photo) {
    yield helper.ensureExists(models.Photo, { id: postId });
  } else if (postType === models.modelConstants.PostTypes.Badge) {
    yield helper.ensureExists(models.Badge, { id: postId });
  } else if (postType === models.modelConstants.PostTypes.Testimonial) {
    yield helper.ensureExists(models.Testimonial, { id: postId });
  }
}

/**
 * Populate post for flag
 * @param {Object} f - the flag to populate post
 */
function* populatePost(f) {
  if (!f) return f;
  if (f.postType === models.modelConstants.PostTypes.Story) {
    f.story = yield helper.ensureExists(models.Story, { id: f.postId });
  } else if (f.postType === models.modelConstants.PostTypes.Photo) {
    f.photo = yield helper.ensureExists(models.Photo, { id: f.postId });
  } else if (f.postType === models.modelConstants.PostTypes.Badge) {
    f.badge = yield helper.ensureExists(models.Badge, { id: f.postId });
  } else if (f.postType === models.modelConstants.PostTypes.Testimonial) {
    f.testimonial = yield helper.ensureExists(models.Testimonial, { id: f.postId });
  }
  return f;
}

/**
 * Create flag
 * @param {object} body - the request body
 */
function* create(body) {
  yield validatePost(body.postId, body.postType);

  const flag = yield models.Flag.create(body);
  return yield getSingle(flag.id);
}

create.schema = {
  body: Joi.object().keys({
    postId: Joi.id(),
    postType: Joi.string().valid(_.values(models.modelConstants.PostTypes)).required(),
    reason: Joi.string().required(),
    explanation: Joi.string().required(),
    status: Joi.string().valid(_.values(models.modelConstants.FlagStatuses)).required(),
    createdBy: Joi.id()
  }).required()
};

/**
 * Get single flag
 * @param {Number} id the id
 */
function* getSingle(id) {
  const flag = yield helper.ensureExists(models.Flag, { id });
  const f = yield helper.populateUsersForEntity(flag);
  return yield populatePost(f);
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update flag
 * @param {Number} id - the id
 * @param {object} body - the request body
 */
function* update(id, body) {
  yield validatePost(body.postId, body.postType);

  const flag = yield helper.ensureExists(models.Flag, { id });
  _.assignIn(flag, body);
  yield flag.save();
  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    postId: Joi.id(),
    postType: Joi.string().valid(_.values(models.modelConstants.PostTypes)).required(),
    reason: Joi.string().required(),
    explanation: Joi.string().required(),
    status: Joi.string().valid(_.values(models.modelConstants.FlagStatuses)).required(),
    createdBy: Joi.optionalId(),
    updatedBy: Joi.id()
  }).required()
};

/**
 * Remove flag
 * @param {Number} id - the id
 */
function* remove(id) {
  const flag = yield helper.ensureExists(models.Flag, { id });
  return yield flag.destroy();
}

remove.schema = {
  id: Joi.id()
};

/**
 * Process flag
 * @param {Number} id - the flag id
 */
function* processFlag(id) {
  const flag = yield helper.ensureExists(models.Flag, { id });
  flag.status = models.modelConstants.FlagStatuses.Processed;
  yield flag.save();
}

processFlag.schema = {
  id: Joi.id()
};


module.exports = {
  search,
  create,
  getSingle,
  update,
  remove,
  processFlag
};

logger.buildService(module.exports);
