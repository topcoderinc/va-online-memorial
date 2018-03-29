'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Sequelize models
 */
const Sequelize = require('sequelize');
const config = require('config');
const constants = require('./constants');

// initialize database connection
const sequelize = new Sequelize(config.dbConfig.db_url, {
  logging: null,
  // native: 'true',
  dialect: 'postgres'
});

// Import models
const Badge = require('./src/Badge')(sequelize, Sequelize);
const BadgeType = require('./src/BadgeType')(sequelize, Sequelize);
const Branch = require('./src/Branch')(sequelize, Sequelize);
const Campaign = require('./src/Campaign')(sequelize, Sequelize);
const Cemetery = require('./src/Cemetery')(sequelize, Sequelize);
const Country = require('./src/Country')(sequelize, Sequelize);
const Event = require('./src/Event')(sequelize, Sequelize);
const EventType = require('./src/EventType')(sequelize, Sequelize);
const File = require('./src/File')(sequelize, Sequelize);
const Flag = require('./src/Flag')(sequelize, Sequelize);
const NextOfKin = require('./src/NextOfKin')(sequelize, Sequelize);
const Photo = require('./src/Photo')(sequelize, Sequelize);
const PostSalute = require('./src/PostSalute')(sequelize, Sequelize);
const Rank = require('./src/Rank')(sequelize, Sequelize);
const Story = require('./src/Story')(sequelize, Sequelize);
const Testimonial = require('./src/Testimonial')(sequelize, Sequelize);
const User = require('./src/User')(sequelize, Sequelize);
const Veteran = require('./src/Veteran')(sequelize, Sequelize);
const War = require('./src/War')(sequelize, Sequelize);
const NotificationPreference = require('./src/NotificationPreference')(sequelize, Sequelize);

// Create associations
const belongsToMany = (source, target, through, as) => {
  source.belongsToMany(target, { through, timestamp: false, as });
};
const belongsTo = (source, target, as) => {
  source.belongsTo(target, { as });
};

belongsTo(Badge, Veteran, 'veteran');
belongsTo(Badge, BadgeType, 'badgeType');
belongsTo(Event, Veteran, 'veteran');
belongsTo(Event, EventType, 'eventType');
belongsTo(NextOfKin, User, 'user');
belongsTo(NextOfKin, Veteran, 'veteran');
belongsTo(Photo, Veteran, 'veteran');
belongsTo(Photo, File, 'photoFile');
belongsTo(PostSalute, User, 'user');
belongsTo(Story, Veteran, 'veteran');
belongsTo(Testimonial, Veteran, 'veteran');
belongsTo(User, Country, 'country');
belongsTo(Veteran, Cemetery, 'cemetery');
belongsTo(Veteran, File, 'profilePicture');
belongsTo(NotificationPreference, User, 'user');

belongsToMany(Veteran, War, 'VeteranWars', 'wars');
belongsToMany(Veteran, Rank, 'VeteranRanks', 'ranks');
belongsToMany(Veteran, Campaign, 'VeteranCampaigns', 'campaigns');
belongsToMany(Veteran, Branch, 'VeteranBranches', 'branches');
belongsToMany(NextOfKin, File, 'NextOfKinProofs', 'proofs');

module.exports = {
  Badge,
  BadgeType,
  Branch,
  Campaign,
  Cemetery,
  Country,
  Event,
  EventType,
  File,
  Flag,
  NextOfKin,
  Photo,
  PostSalute,
  Rank,
  Story,
  Testimonial,
  User,
  Veteran,
  War,
  NotificationPreference,
  sequelize,
  Sequelize,
  syncDB: force => sequelize.sync({ force }),
  modelConstants: constants
};
