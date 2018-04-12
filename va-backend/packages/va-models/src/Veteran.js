'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Veteran model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Veteran', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  midName: DataTypes.STRING,
  birthDate: DataTypes.DATEONLY,
  deathDate: DataTypes.DATEONLY,
  suffix: DataTypes.STRING,
  bio: DataTypes.STRING,
  squadronShip: DataTypes.STRING,
  burialLocation: DataTypes.STRING,
  veteranId: DataTypes.STRING,
}, {
  timestamps: false
});
