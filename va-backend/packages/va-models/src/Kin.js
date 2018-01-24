'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Kin model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Kin', {
  v_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  relationship: { type: DataTypes.STRING, allowNull: false },
  v_first_name: { type: DataTypes.STRING, allowNull: false },
  v_mid_name: DataTypes.STRING,
  v_last_name: { type: DataTypes.STRING, allowNull: false },
  v_suffix: DataTypes.STRING
}, {
  timestamps: false
});
