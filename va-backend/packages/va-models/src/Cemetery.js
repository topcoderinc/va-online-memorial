'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Cemetery model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Cemetery', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  addrOne: { type: DataTypes.STRING, allowNull: false },
  addrTwo: DataTypes.STRING,
  url: DataTypes.STRING,
  phone: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
}, {
  timestamps: false
});
