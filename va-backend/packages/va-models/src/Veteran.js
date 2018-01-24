'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Veteran model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Veteran', {
  d_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  d_first_name: { type: DataTypes.STRING, allowNull: false },
  d_mid_name: DataTypes.STRING,
  d_last_name: { type: DataTypes.STRING, allowNull: false },
  d_birth_date: { type: DataTypes.DATEONLY, allowNull: false },
  d_death_date: { type: DataTypes.DATEONLY, allowNull: false },
  d_suffix: DataTypes.STRING
}, {
  timestamps: false
});
