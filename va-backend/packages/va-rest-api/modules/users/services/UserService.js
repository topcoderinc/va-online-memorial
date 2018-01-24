'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * User service
 */
const _ = require('lodash');
const Joi = require('joi');
const logger = require('../../../common/logger');
const { User } = require('@va/models');
const { ConflictError, UnauthorizedError } = require('../../../common/errors');
const { encryptPassword, createToken, comparePassword } = require('../helper');

/**
 * Register user
 * @param {object} user - The user object
 */
function* register(user) {
  // Check if email is already registered
  const existing = yield User.findById(user.email);
  if (existing) throw new ConflictError(`${user.email} is already registered.`);

  // Encrypt password
  user.passwordHash = yield encryptPassword(user.password);
  const newUser = yield User.create(_.omit(user, ['password']));

  // Generate token
  const token = createToken(_.omit(newUser.toJSON(), ['passwordHash']));

  return _.extend(_.omit(newUser.toJSON(), ['password']), { token });
}

register.schema = {
  user: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    country: Joi.string().required(),
    password: Joi.string().required()
  }).required()
};

/**
 * Login
 * @param {object} credentials - The login credentials
 */
function* login(credentials) {
  // Check if email is correct (registered)
  const user = yield User.findOne({ where: { email: credentials.email } });
  if (!user) throw new UnauthorizedError('Invalid credentials!');

  // Check if password matches with the encrypted password
  const passwordMatch = yield comparePassword(credentials.password, user.passwordHash);
  if (!passwordMatch) throw new UnauthorizedError('Invalid credentials!');

  // Generate token
  const token = createToken(_.omit(user.toJSON(), ['passwordHash']));
  return _.extend(_.omit(user.toJSON(), ['passwordHash']), { token });
}

login.schema = {
  credentials: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).required()
};

module.exports = {
  register,
  login
};

logger.buildService(module.exports);
