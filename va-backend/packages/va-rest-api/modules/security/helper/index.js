'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Helper methods
 */
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const ms = require('ms');

/**
 * Create token
 * @param {Object} user the user object
 */
function createToken(user) {
  return jwt.sign(_.pick(user, ['id', 'username', 'email', 'role']), config.authSecret, {
    expiresIn: config.tokenExpiresIn
  });
}

/**
 * Encrypt password
 * @param {string} password the password to encrypt
 */
function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(config.salt, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(password, salt, null, (hashErr, hash) => {
        if (hashErr) return reject(hashErr);
        resolve(hash);
      });
    });
  });
}

/**
 * Compare password with the encrypted password
 * @param {string} password the password to compare
 * @param {string} userPassword the password to compare to
 */
function comparePassword(password, userPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, (err, isPasswordMatch) => {
      if (err) return reject(err);
      return resolve(isPasswordMatch);
    });
  });
}

/**
 * Convert user
 * @param {Object} user the user
 */
function convertUser(user) {
  if (!user) return user;
  return _.omit(user, ['passwordHash', 'lastLogin',
    'accessToken', 'accessTokenExpiresAt', 'forgotPasswordToken', 'forgotPasswordTokenExpiresAt']);
}

/**
 * Get expires date
 * @param {String} ts the time string
 */
function getExpiresDate(ts) {
  const d = new Date();
  d.setTime(d.getTime() + ms(ts));
  return d;
}

module.exports = {
  createToken,
  encryptPassword,
  comparePassword,
  convertUser,
  getExpiresDate
};
