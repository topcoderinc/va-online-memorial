'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * User service
 */
const Joi = require('joi');
const config = require('config');
const logger = require('../../../common/logger');
const helper = require('../../../common/helper');
const {
  User,
  modelConstants
} = require('@va/models');
const {
  ConflictError,
  UnauthorizedError,
  ValidationError
} = require('../../../common/errors');
const {
  encryptPassword,
  createToken,
  comparePassword,
  getExpiresDate
} = require('../helper');

/**
 * Register user
 * @param {object} user - The user object
 */
function* register(user) {
  // Check if email is already registered
  let existing = yield User.findOne({ where: { email: user.email } });
  if (existing) throw new ConflictError(`Email: ${user.email} is already registered.`);

  // Check if username is already registered
  existing = yield User.findOne({ where: { username: user.username } });
  if (existing) throw new ConflictError(`Username: ${user.username} is already registered.`);

  user.role = modelConstants.UserRoles.User;
  user.status = modelConstants.UserStatuses.Active;
  // Encrypt password
  user.passwordHash = yield encryptPassword(user.password);
  delete user.password;
  const newUser = yield User.create(user);

  // Generate token
  const token = createToken(newUser.toJSON());
  newUser.accessToken = token;
  newUser.accessTokenExpiresAt = getExpiresDate(config.tokenExpiresIn);

  const updatedUser = yield newUser.save();
  return updatedUser.toJSON();
}

register.schema = {
  user: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string().required(),
    gender: Joi.string().required(),
    countryId: Joi.number().integer().min(1).required(),
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
  const token = createToken(user.toJSON());
  user.accessToken = token;
  user.accessTokenExpiresAt = getExpiresDate(config.tokenExpiresIn);
  user.lastLogin = new Date();

  const updatedUser = yield user.save();
  return updatedUser.toJSON();
}

login.schema = {
  credentials: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).required()
};

/**
 * Initiate forgot password
 * @param {object} body - The request body
 */
function* initiateForgotPassword(body) {
  const user = yield helper.ensureExists(User, { email: body.email });
  // Generate token
  const token = createToken({ email: body.email });
  user.forgotPasswordToken = token;
  user.forgotPasswordTokenExpiresAt = getExpiresDate(config.tokenExpiresIn);
  yield user.save();
  // simply log the token
  logger.info(`Forgot password token: ${token}`);
}

initiateForgotPassword.schema = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  }).required()
};

/**
 * Change forgot password
 * @param {object} body - The request body
 */
function* changeForgotPassword(body) {
  const user = yield helper.ensureExists(User, { email: body.email });
  if (user.forgotPasswordToken !== body.forgotPasswordToken) {
    throw new ValidationError('Invalid forgot password token.');
  }
  if (user.forgotPasswordTokenExpiresAt.getTime() < new Date().getTime()) {
    throw new ValidationError('Forgot password token expired.');
  }
  // Encrypt password
  user.passwordHash = yield encryptPassword(body.newPassword);
  user.forgotPasswordToken = null;
  user.forgotPasswordTokenExpiresAt = null;
  yield user.save();
}

changeForgotPassword.schema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required(),
    forgotPasswordToken: Joi.string().required()
  }).required()
};

/**
 * Update password
 * @param {Number} userId - the user id
 * @param {object} body - The request body
 */
function* updatePassword(userId, body) {
  const user = yield helper.ensureExists(User, { id: userId });
  // Check if old password matches with the encrypted password
  const passwordMatch = yield comparePassword(body.oldPassword, user.passwordHash);
  if (!passwordMatch) throw new UnauthorizedError('Invalid credentials!');
  // Encrypt password
  user.passwordHash = yield encryptPassword(body.newPassword);
  yield user.save();
}

updatePassword.schema = {
  userId: Joi.number().integer().min(1).required(),
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  }).required()
};

module.exports = {
  register,
  login,
  initiateForgotPassword,
  changeForgotPassword,
  updatePassword
};

logger.buildService(module.exports);
