'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

const _ = require('lodash');
const { Statuses } = require('../constants');

/*
 * Next of Kin model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('NextOfKin', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: Statuses.Requested,
    values: _.values(Statuses),
  },
  response: DataTypes.STRING,
  createdBy: { type: DataTypes.BIGINT, allowNull: false },
  updatedBy: DataTypes.BIGINT
}, {});
