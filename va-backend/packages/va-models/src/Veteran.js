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
  midName: { type: DataTypes.STRING, allowNull: false },
  birthDate: { type: DataTypes.DATEONLY, allowNull: false },
  deathDate: { type: DataTypes.DATEONLY, allowNull: false },
  suffix: DataTypes.STRING,
  bio: { type: DataTypes.STRING, allowNull: false },
  squadronShip: DataTypes.STRING,
  burialLocation: DataTypes.STRING,
}, {
  timestamps: false
});
