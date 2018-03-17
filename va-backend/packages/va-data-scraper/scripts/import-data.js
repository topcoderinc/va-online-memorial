'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Import data
 */
require('dotenv').config();

const ProgressBar = require('ascii-progress');
const config = require('config');
const co = require('co');
const chalk = require('chalk');
const logger = require('../common/logger');
const datasetService = require('../services/dataset');
const dataService = require('../services/data');
const { syncDB, sequelize } = require('@va/models');

require('rxjs/Rx');
require('rxjs-to-async-iterator');

co(function* () {
  logger.info(`connecting to database: ${config.dbConfig.db_url}`);
  yield syncDB();

  /**
   * Read file line by line.
   *
   * @param {string} filePath The file path
   * @param {object} transaction Sequelize transaction object
   * @return {integer} the number of lines read
   */
  function* readFileLines(filePath, transaction) {
    let processingProgress = 0;
    let totalInserted = 0;
    let nth = 0;
    let running = true;

    const bar = new ProgressBar({
      schema: '[:bar] :percent :elapseds :etas',
      total: 100
    });
    const rowCount = yield dataService.countFileLines(filePath);
    const iter = datasetService.readCSV(filePath).toAsyncIterator();

    logger.info(`Processing file ${filePath}`);
    while (running) {
      // fetch next line
      let line = null;
      try {
        line = yield iter.nextValue();
      } catch (error) {
        // end of file
        running = false;
      }

      // process line and save to database
      if (running) {
        const inserted = yield dataService.processLine(line, transaction);
        if (inserted) {
          totalInserted += 1;
        }
        nth += 1;

        const newProgress = parseInt((100 * nth) / rowCount, 10);
        if (newProgress > processingProgress) {
          bar.tick(newProgress - processingProgress);
          processingProgress = newProgress;

          // keep memory controlled
          global.gc(true);
        }
      }
    }
    logger.info(`Parsed file ${filePath} with ${nth} lines. Inserted ${totalInserted} veterans`);

    iter.unsubscribe();

    if (rowCount > nth) {
      logger.warn(`Missed ${rowCount - nth} line(s)`);
    }

    return nth;
  }

  /**
   * Read CSV file.
   * @param {integer} index The index of the file array
   */
  function* readFile(index) {
    const file = files[index];

    try {
      yield sequelize.transaction(t => co(function* () {
        // execute file line read
        yield readFileLines(`${config.downloadPath}/${file}`, t);
      }));
    } catch (error) {
      logger.error(`Failed to read file. Stack: ${error}`);
    }
  }

  const files = datasetService.getFilenames(config.downloadPath);

  if (files.length === 0) return null;

  for (let index = 0; index < files.length; index += 1) {
    yield readFile(index);
  }

  return true;
}).then((completed) => {
  if (completed) {
    logger.info('Operation completed!');
  } else {
    logger.info('No data available!');
    logger.info(`Run ${chalk.cyan('npm run download-data')} to download the datasets.`);
  }
  process.exit();
}).catch((error) => {
  logger.error(error.message);
  logger.error(error);
  process.exit();
});
