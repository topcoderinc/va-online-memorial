/**
 * Copyright (C) 2018 TopCoder Inc., All Rights Reserved.
 */

/**
 * this script is used to init data, it clears all data, then inserts some sample data
 * note: it will be drop all tables and data , then create the new tables
 *
 * @author      TCSCODER
 * @version     1.0
 */

const co = require('co');

const models = require('@va/models');
const logger = require('./common/logger');
const helper = require('./modules/security/helper');

co(function* () {
  // create lookup entities
  yield models.BadgeType.create({ name: 'A Hero', iconURL: 'hero' });
  yield models.BadgeType.create({ name: 'Bravery', iconURL: 'bravery' });
  yield models.BadgeType.create({ name: 'Instructor', iconURL: 'instructor' });
  yield models.BadgeType.create({ name: 'Friendship', iconURL: 'friendship' });
  yield models.BadgeType.create({ name: 'A Leader', iconURL: 'leader' });
  yield models.BadgeType.create({ name: 'Charger', iconURL: 'charger' });
  yield models.BadgeType.create({ name: 'Big Heart', iconURL: 'big-heart' });
  yield models.Branch.create({ name: 'branch1' });
  yield models.Branch.create({ name: 'branch2' });
  yield models.Campaign.create({ name: 'campaign1' });
  yield models.Campaign.create({ name: 'campaign2' });
  yield models.Country.create({ name: 'USD' });
  yield models.Country.create({ name: 'CHINA' });
  yield models.EventType.create({ name: 'Born', iconURL: 'event Born' });
  yield models.EventType.create({ name: 'Wedding', iconURL: 'event Wedding' });
  yield models.EventType.create({ name: 'Enlisted', iconURL: 'event Enlisted' });
  yield models.EventType.create({ name: 'Lieutenant Promottion', iconURL: 'event Lieutenant Promottion' });
  yield models.EventType.create({ name: 'Passed Away', iconURL: 'event Passed Away' });
  // create admin
  const passwordHash = yield helper.encryptPassword('password');
  yield models.User.create({
    username: 'admin',
    email: 'admin@test.com',
    firstName: 'first name 1',
    lastName: 'last name 1',
    mobile: '123123123',
    role: models.modelConstants.UserRoles.Admin,
    status: models.modelConstants.UserStatuses.Active,
    gender: 'male',
    passwordHash,
    countryId: 1
  });
  // create normal user
  yield models.User.create({
    username: 'user',
    email: 'user@test.com',
    firstName: 'first name 2',
    lastName: 'last name 2',
    mobile: '123125555',
    role: models.modelConstants.UserRoles.User,
    status: models.modelConstants.UserStatuses.Active,
    gender: 'male',
    passwordHash,
    countryId: 2
  });
  logger.info('success!');
  process.exit(0);
}).catch((err) => {
  logger.error(err);
  logger.info('got error, program will exit');
  process.exit(1);
});
