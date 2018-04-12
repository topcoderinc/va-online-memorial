'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Burial model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Burial', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  sectionId: DataTypes.STRING,
  rowNum: DataTypes.STRING,
  siteNum: DataTypes.STRING
}, {
  timestamps: false
});
