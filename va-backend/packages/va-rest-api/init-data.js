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
  yield models.syncDB(true);

  // create lookup entities
  yield models.BadgeType.create({ name: 'badge type 1', iconURL: 'http://test.com/icon1.jpg' });
  yield models.BadgeType.create({ name: 'badge type 2', iconURL: 'http://test.com/icon2.jpg' });
  yield models.Branch.create({ name: 'branch1' });
  yield models.Branch.create({ name: 'branch2' });
  yield models.Campaign.create({ name: 'campaign1' });
  yield models.Campaign.create({ name: 'campaign2' });
  yield models.Cemetery.create({
    addrOne: 'addr 1',
    addrTwo: 'addr 2',
    url: 'http://test.com/cemetery1',
    phone: '111222333',
    city: 'city',
    state: 'state',
    zip: '123123',
    name: 'cemetery1'
  });
  yield models.Country.create({ name: 'country1' });
  yield models.Country.create({ name: 'country2' });
  yield models.EventType.create({ name: 'event type 1', iconURL: 'http://test.com/eventtype1.png' });
  yield models.EventType.create({ name: 'event type 2', iconURL: 'http://test.com/eventtype2.png' });
  yield models.Rank.create({ name: 'rank1' });
  yield models.Rank.create({ name: 'rank2' });
  yield models.War.create({ name: 'war1' });
  yield models.War.create({ name: 'war2' });

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

  // create veteran
  const veteran = yield models.Veteran.create({
    firstName: 'ffff',
    lastName: 'llll',
    midName: 'mmmm',
    birthDate: new Date(),
    deathDate: new Date(),
    suffix: 'suffix',
    bio: 'bio',
    squadronShip: 'squadron ship',
    burialLocation: 'burial location',
    cemeteryId: 1
  });
  yield veteran.setWars([1, 2]);
  yield veteran.setRanks([1, 2]);
  yield veteran.setCampaigns([1, 2]);
  yield veteran.setBranches([1, 2]);

  logger.info('success!');
  process.exit(0);
}).catch((err) => {
  logger.error(err);
  logger.info('got error, program will exit');
  process.exit(1);
});
