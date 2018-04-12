/**
 * Copyright (C) 2018 TopCoder Inc., All Rights Reserved.
 */

/**
 * This script is used to clear all data in database.
 * note: it will be drop all tables and data , then create the new tables
 *
 * @author      TCSCODER
 * @version     1.0
 */

const co = require('co');

const models = require('@va/models');
const logger = require('../common/logger');

co(function* () {
  yield models.syncDB(true);
  logger.info('success!');
  process.exit(0);
}).catch((err) => {
  logger.error(err);
  logger.info('got error, program will exit');
  process.exit(1);
});
