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

/**
 * Create token
 * @param {Object} user the user object
 */
function createToken(user) {
  return jwt.sign(user, config.authSecret, {
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

module.exports = {
  createToken,
  encryptPassword,
  comparePassword
};
