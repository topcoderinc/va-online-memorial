'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Campaign model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Campaign', {
  id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
