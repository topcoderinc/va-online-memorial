'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Import data
 */
require('dotenv').config();
const config = require('config');
const co = require('co');
const chalk = require('chalk');
const logger = require('../common/logger');
const datasetService = require('../services/dataset');
const dataService = require('../services/data');
const { syncDB } = require('@va/models');

co(function* () {
  logger.info(`connecting to database: ${config.dbConfig.db_url}`);
  yield syncDB();
  const files = datasetService.getFilenames(config.downloadPath);

  /**
    * Read each dataset recursively.
    * @param {integer} index - The dataset index
    */
  function* readfile(index) {
    logger.info(`Processing file: ${files[index]}`);
    yield dataService.processFile(yield datasetService.readCSV(`${config.downloadPath}/${files[index]}`));
    return index < files.length - 1 ? yield readfile(index + 1) : true;
  }

  if (files.length === 0) return null;

  return yield readfile(0);
})
  .then((completed) => {
    if (completed) {
      logger.info('Operation completed!');
    } else {
      logger.info('No data available!');
      logger.info(`Run ${chalk.cyan('npm run download-data')} to download the datasets.`);
    }
    process.exit();
  })
  .catch((error) => {
    logger.error(error.message);
    logger.error(error);
    process.exit();
  });
