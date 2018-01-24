'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Cemetery model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Cemetery', {
  cem_id: { type: DataTypes.STRING, primaryKey: true, unique: true },
  cem_name: { type: DataTypes.STRING, allowNull: false },
  cem_addr_one: { type: DataTypes.STRING, allowNull: false },
  cem_addr_two: DataTypes.STRING,
  cem_url: DataTypes.STRING,
  cem_phone: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.INTEGER
}, {
  timestamps: false
});
