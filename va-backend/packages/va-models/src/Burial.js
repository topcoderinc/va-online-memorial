'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Burial model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Burial', {
  d_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  cem_id: { type: DataTypes.STRING, allowNull: false },
  section_id: DataTypes.STRING,
  row_num: DataTypes.STRING,
  site_num: DataTypes.STRING
}, {
  timestamps: false
});
