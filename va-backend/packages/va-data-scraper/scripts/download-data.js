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

  /**
    * Download each dataset recursively.
    * @param {integer} index - The dataset index
    */
  function* download(index) {
    logger.info(`Downloading dataset: ${datasets[index].title}`);
    yield datasetService.downloadDataset(datasets[index].downloadURL);
    logger.info('Download completed!');
    return index < datasets.length - 1 ? yield download(index + 1) : true;
  }

  if (datasets.length === 0) return null;

  return yield download(0);
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
