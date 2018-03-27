'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */
const _ = require('lodash');
const { FlagStatuses } = require('../constants');

/*
 * Flag model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Flag', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.BIGINT, allowNull: false },
  postType: { type: DataTypes.STRING, allowNull: false },
  reason: { type: DataTypes.STRING, allowNull: false },
  explanation: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: FlagStatuses.Requested,
    values: _.values(FlagStatuses),
  },
  createdBy: { type: DataTypes.BIGINT, allowNull: false },
  updatedBy: DataTypes.BIGINT
}, {});
