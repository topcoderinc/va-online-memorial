'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Sequelize models
 */
const Sequelize = require('sequelize');
const config = require('config');

// initialize database connection
const sequelize = new Sequelize(config.dbConfig.db_url, {
  logging: config.logLevel === 'debug',
  operatorsAliases: Sequelize.Op,
  native: 'true',
  dialect: 'postgres'
});

// Import models
const Veteran = require('./src/Veteran')(sequelize, Sequelize);
const Cemetery = require('./src/Cemetery')(sequelize, Sequelize);
const Kin = require('./src/Kin')(sequelize, Sequelize);
const Branch = require('./src/Branch')(sequelize, Sequelize);
const War = require('./src/War')(sequelize, Sequelize);
const Rank = require('./src/Rank')(sequelize, Sequelize);
const Burial = require('./src/Burial')(sequelize, Sequelize);
const User = require('./src/User')(sequelize, Sequelize);

// Create associations
Veteran.hasOne(Burial, { as: 'burial', foreignKey: 'burial_id', targetKey: 'd_id' });
Veteran.hasOne(Kin, { as: 'kin', foreignKey: 'kin_id', targetKey: 'v_id' });
Burial.belongsTo(Cemetery, { as: 'cemetery', foreignKey: 'cem_id' });

Veteran.belongsToMany(Branch, { through: 'VeteranBranch', as: 'branches' });
Veteran.belongsToMany(War, { through: 'VeteranWar', as: 'wars' });
Veteran.belongsToMany(Rank, { through: 'VeteranRank', as: 'ranks' });

module.exports = {
  Veteran,
  Cemetery,
  Kin,
  Branch,
  War,
  Rank,
  Burial,
  User,
  sequelize,
  syncDB: force => sequelize.sync({ force })
};
