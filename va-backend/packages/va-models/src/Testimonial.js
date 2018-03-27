'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */
const _ = require('lodash');
const { Statuses } = require('../constants');

/*
 * Testimonial model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Testimonial', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    defaultValue: Statuses.Requested,
    values: _.values(Statuses),
  },
  title: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
  createdBy: { type: DataTypes.BIGINT, allowNull: false },
  updatedBy: DataTypes.BIGINT
}, {});
