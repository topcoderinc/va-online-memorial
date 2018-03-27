'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Testimonial service
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
 * Search testimonials
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
  const docs = yield models.Testimonial.findAndCountAll(q);
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
 * Create testimonial
 * @param {object} body - the request body
 */
function* create(body) {
  yield helper.ensureExists(models.Veteran, { id: body.veteranId });

  const testimonial = yield models.Testimonial.create(body);
  return yield getSingle(testimonial.id);
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
 * Get single testimonial
 * @param {Number} id the id
 */
function* getSingle(id) {
  const testimonial = yield models.Testimonial.findOne({
    where: { id },
    include: [
      {
        model: models.Veteran,
        as: 'veteran'
      }
    ]
  });
  if (!testimonial) throw new NotFoundError(`Testimonial with id: ${id} does not exist!`);
  return yield helper.populateUsersForEntity(testimonial);
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update testimonial
 * @param {Number} id - the id
 * @param {object} body - the request body
 */
function* update(id, body) {
  if (body.veteranId) {
    yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  }

  const testimonial = yield helper.ensureExists(models.Testimonial, { id });
  _.assignIn(testimonial, body);
  yield testimonial.save();
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
 * Remove testimonial
 * @param {Number} id - the id
 */
function* remove(id) {
  const testimonial = yield helper.ensureExists(models.Testimonial, { id });
  return yield testimonial.destroy();
}

remove.schema = {
  id: Joi.id()
};

/**
 * Approve testimonial
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* approve(id, user) {
  const testimonial = yield helper.ensureExists(models.Testimonial, { id });
  if (!(yield helper.canManageVeteran(user, testimonial.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  testimonial.status = models.modelConstants.Statuses.Approved;
  testimonial.updatedBy = user.id;
  yield testimonial.save();
}

approve.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Reject testimonial
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* reject(id, user) {
  const testimonial = yield helper.ensureExists(models.Testimonial, { id });
  if (!(yield helper.canManageVeteran(user, testimonial.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  testimonial.status = models.modelConstants.Statuses.Rejected;
  testimonial.updatedBy = user.id;
  yield testimonial.save();
}

reject.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Salute testimonial
 * @param {Number} id - the testimonial id
 * @param {Number} userId - the current user id
 */
function* salute(id, userId) {
  yield helper.ensureExists(models.Testimonial, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Testimonial,
      postId: id
    }
  });
  if (!s) {
    yield models.PostSalute.create({
      userId,
      postType: models.modelConstants.PostTypes.Testimonial,
      postId: id
    });
  }
}

salute.schema = {
  id: Joi.id(),
  userId: Joi.id()
};

/**
 * Check whether user saluted the testimonial
 * @param {Number} id - the testimonial id
 * @param {Number} userId - the current user id
 */
function* isSaluted(id, userId) {
  yield helper.ensureExists(models.Testimonial, { id });

  const s = yield models.PostSalute.findOne({
    where: {
      userId,
      postType: models.modelConstants.PostTypes.Testimonial,
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
 * Share testimonial
 * @param {Number} id - the testimonial id
 * @param {Number} userId - the current user id
 */
function* share(id, userId) { // eslint-disable-line no-unused-vars
  yield helper.ensureExists(models.Testimonial, { id });
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
