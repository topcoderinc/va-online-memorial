'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * User service
 */
const Joi = require('joi');
const _ = require('lodash');
const models = require('@va/models');
const logger = require('../../../common/logger');
const { NotFoundError, ForbiddenError } = require('../../../common/errors');
const helper = require('../../../common/helper');
const securityHelper = require('../../security/helper');

/**
 * build db search query
 * @param filter the search filter
 */
function buildDBFilter(filter) {
  const include = [{ model: models.Country, as: 'country' }];

  const where = {};
  if (filter.name) {
    where.$or = [{
      firstName: { $like: `%${filter.name}%` }
    }, {
      lastName: { $like: `%${filter.name}%` }
    }, {
      username: { $like: `%${filter.name}%` }
    }];
  }
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
 * Search users
 * @param {object} query the query object
 */
function* search(query) {
  const q = buildDBFilter(query);
  const docs = yield models.User.findAndCountAll(q);
  const items = _.map(docs.rows, row => securityHelper.convertUser(row.toJSON()));
  return {
    items,
    total: docs.count,
    offset: q.offset,
    limit: q.limit
  };
}

search.schema = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(_.values(models.modelConstants.UserStatuses)),
    limit: Joi.limit(),
    offset: Joi.offset(),
    sortColumn: Joi.string().valid(
      'id', 'username', 'firstName', 'lastName', 'mobile', 'countryId', 'role',
      'status', 'gender'
    ).default('id'),
    sortOrder: Joi.sortOrder()
  })
};

/**
 * Get single user
 * @param {Number} id the user id
 */
function* getSingle(id) {
  const user = yield models.User.findOne({
    where: { id },
    include: [
      {
        model: models.Country,
        as: 'country'
      }
    ]
  });
  if (!user) throw new NotFoundError(`User with id: ${id} does not exist!`);
  return securityHelper.convertUser(user.toJSON());
}

getSingle.schema = {
  id: Joi.id()
};

/**
 * Update user
 * @param {Number} id - the user id
 * @param {object} body - the request body
 * @param {object} currentUser - the current user
 */
function* update(id, body, currentUser) {
  const user = yield helper.ensureExists(models.User, { id });

  // if current user is not admin, then he can only update himself, and role can not be changed
  if (currentUser.role !== models.modelConstants.UserRoles.Admin) {
    if (id !== currentUser.id) {
      throw new ForbiddenError('You can not update other user.');
    }
    if (body.role && user.role !== body.role) {
      throw new ForbiddenError('You can not change your role.');
    }
  }

  _.assignIn(user, body);
  yield user.save();
  return yield getSingle(id);
}

update.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    mobile: Joi.string(),
    countryId: Joi.optionalId(),
    role: Joi.string(),
    status: Joi.string().valid(_.values(models.modelConstants.UserStatuses)),
    gender: Joi.string()
  }).required(),
  currentUser: Joi.object().required()
};

/**
 * Get me
 * @param {Number} id - the user id
 */
function* getMe(id) {
  return yield getSingle(id);
}

getMe.schema = {
  id: Joi.id()
};

/**
 * Deactivate me
 * @param {Number} id - the user id
 */
function* deactivateMe(id) {
  const user = yield helper.ensureExists(models.User, { id });
  user.status = models.modelConstants.UserStatuses.Inactive;
  yield user.save();
}

deactivateMe.schema = {
  id: Joi.id()
};

/**
 * Activate me
 * @param {Number} id - the user id
 */
function* activateMe(id) {
  const user = yield helper.ensureExists(models.User, { id });
  user.status = models.modelConstants.UserStatuses.Active;
  yield user.save();
}

activateMe.schema = {
  id: Joi.id()
};

/**
 * Get notification preferences
 * @param {Number} id - the user id
 */
function* getNotificationPreferences(id) {
  yield helper.ensureExists(models.User, { id });

  return yield helper.ensureExists(models.NotificationPreference, { userId: id });
}

getNotificationPreferences.schema = {
  id: Joi.id()
};

/**
 * Save notification preferences
 * @param {Number} id - the user id
 * @param {Number} body - the request body
 */
function* saveNotificationPreferences(id, body) {
  yield helper.ensureExists(models.User, { id });

  const p = yield models.NotificationPreference.findOne({ where: { userId: id } });
  if (p) {
    _.assignIn(p, body);
    return yield p.save();
  }

  body.userId = id;
  return yield models.NotificationPreference.create(body);
}

saveNotificationPreferences.schema = {
  id: Joi.id(),
  body: Joi.object().keys({
    storyNotificationsSite: Joi.boolean(),
    storyNotificationsEmail: Joi.boolean(),
    storyNotificationsMobile: Joi.boolean(),
    badgeNotificationsSite: Joi.boolean(),
    badgeNotificationsEmail: Joi.boolean(),
    badgeNotificationsMobile: Joi.boolean(),
    testimonialNotificationsSite: Joi.boolean(),
    testimonialNotificationsEmail: Joi.boolean(),
    testimonialNotificationsMobile: Joi.boolean(),
    photoNotificationsSite: Joi.boolean(),
    photoNotificationsEmail: Joi.boolean(),
    photoNotificationsMobile: Joi.boolean(),
    eventNotificationsSite: Joi.boolean(),
    eventNotificationsEmail: Joi.boolean(),
    eventNotificationsMobile: Joi.boolean()
  }).required()
};

module.exports = {
  search,
  getSingle,
  update,
  getMe,
  deactivateMe,
  activateMe,
  getNotificationPreferences,
  saveNotificationPreferences
};

logger.buildService(module.exports);
