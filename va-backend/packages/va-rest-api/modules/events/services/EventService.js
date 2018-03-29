'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Event service
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
  const include = [{ model: models.Veteran, as: 'veteran' }, { model: models.EventType, as: 'eventType' }];

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
 * Search events
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
  const docs = yield models.Event.findAndCountAll(q);
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
    sortColumn: Joi.string().valid('id', 'veteranId', 'eventDate', 'eventTypeId', 'status').default('id'),
    sortOrder: Joi.sortOrder()
  }),
  user: Joi.object().required()
};

/**
 * Create event
 * @param {object} body - the request body
 */
function* create(body) {
  yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  yield helper.ensureExists(models.EventType, { id: body.eventTypeId });

  const event = yield models.Event.create(body);
  return yield getSingle(event.id);
}

create.schema = {
  body: Joi.object().keys({
    veteranId: Joi.id(),
    eventTypeId: Joi.id(),
    eventDate: Joi.date().required(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)).required(),
    createdBy: Joi.id()
  }).required()
};

/**
 * Get single event
 * @param {Number} id the id
 */
function* getSingle(id) {
  const event = yield models.Event.findOne({
    where: { id },
    include: [
      {
        model: models.Veteran,
        as: 'veteran'
      },
      {
        model: models.EventType,
        as: 'eventType'
      }
    ]
  });
  if (!event) throw new NotFoundError(`Event with id: ${id} does not exist!`);
  return yield helper.populateUsersForEntity(event);
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update event
 * @param {Number} id - the id
 * @param {object} body - the request body
 */
function* update(id, body) {
  if (body.veteranId) {
    yield helper.ensureExists(models.Veteran, { id: body.veteranId });
  }
  if (body.eventTypeId) {
    yield helper.ensureExists(models.EventType, { id: body.eventTypeId });
  }

  const event = yield helper.ensureExists(models.Event, { id });
  _.assignIn(event, body);
  yield event.save();
  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    veteranId: Joi.optionalId(),
    eventTypeId: Joi.optionalId(),
    eventDate: Joi.date(),
    status: Joi.string().valid(_.values(models.modelConstants.Statuses)),
    createdBy: Joi.optionalId(),
    updatedBy: Joi.id()
  }).required()
};

/**
 * Remove event
 * @param {Number} id - the id
 */
function* remove(id) {
  const event = yield helper.ensureExists(models.Event, { id });
  return yield event.destroy();
}

remove.schema = {
  id: Joi.id()
};

/**
 * Approve event
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* approve(id, user) {
  const event = yield helper.ensureExists(models.Event, { id });
  if (!(yield helper.canManageVeteran(user, event.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  event.status = models.modelConstants.Statuses.Approved;
  event.updatedBy = user.id;
  yield event.save();
}

approve.schema = {
  id: Joi.id(),
  user: Joi.object().required()
};

/**
 * Reject event
 * @param {Number} id - the id
 * @param {Object} user - the current user
 */
function* reject(id, user) {
  const event = yield helper.ensureExists(models.Event, { id });
  if (!(yield helper.canManageVeteran(user, event.veteranId))) {
    throw new ForbiddenError('User is not allowed to manage the veteran.');
  }
  event.status = models.modelConstants.Statuses.Rejected;
  event.updatedBy = user.id;
  yield event.save();
}

reject.schema = {
  id: Joi.id(),
  user: Joi.object().required()
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
