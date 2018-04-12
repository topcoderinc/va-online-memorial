'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Kin model definition.
 * Kin is data loaded by scraper. It can be used by admin to help approve/reject NextOfKin requests.
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Kin', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  relationship: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  midName: DataTypes.STRING,
  lastName: { type: DataTypes.STRING, allowNull: false },
  suffix: DataTypes.STRING
}, {
  timestamps: false
});
