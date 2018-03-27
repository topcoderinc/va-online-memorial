'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * User model definition
 */
const { UserStatuses, UserRoles } = require('../constants');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: UserRoles.User,
    values: _.values(UserRoles),
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: UserStatuses.Active,
    values: _.values(UserStatuses),
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastLogin: DataTypes.DATE,
  accessToken: DataTypes.STRING(3000),
  accessTokenExpiresAt: DataTypes.DATE,
  forgotPasswordToken: DataTypes.STRING(3000),
  forgotPasswordTokenExpiresAt: DataTypes.DATE,
}, {
  timestamps: false
});
