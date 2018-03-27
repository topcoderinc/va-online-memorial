'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Event type model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('EventType', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  iconURL: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
