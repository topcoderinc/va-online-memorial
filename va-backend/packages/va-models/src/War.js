'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * War model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('War', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
