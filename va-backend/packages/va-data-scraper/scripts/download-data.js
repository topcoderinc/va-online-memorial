'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Download available datasets
 */
require('dotenv').config();
const co = require('co');
const logger = require('../common/logger');
const datasetService = require('../services/dataset');

co(function* () {
  // Fetch datasets
  logger.info('Fetching available datasets...');
  const datasets = yield datasetService.getAvailableDatasets();
  logger.info(`Found ${datasets.length} available datasets.\n`);

  if (datasets.length === 0) return null;

  // Download each dataset.
  for (let index = 0; index < datasets.length; index += 1) {
    logger.info(`Downloading dataset: ${datasets[index].title}`);
    yield datasetService.downloadDataset(datasets[index].downloadURL);
    logger.info('Download completed!');
  }

  return true;
})
  .then((completed) => {
    if (completed) {
      logger.info('Operation completed!');
    } else {
      logger.info('No data available!\n');
    }
    process.exit();
  })
  .catch((error) => {
    logger.error(error.message);
    process.exit();
  });
