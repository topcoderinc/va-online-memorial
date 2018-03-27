'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */
const _ = require('lodash');
const { Statuses } = require('../constants');

/*
 * Event model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Event', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  eventDate: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: Statuses.Requested,
    values: _.values(Statuses),
  },
  createdBy: { type: DataTypes.BIGINT, allowNull: false },
  updatedBy: DataTypes.BIGINT
}, {});
