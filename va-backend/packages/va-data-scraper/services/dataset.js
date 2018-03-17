'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Dataset service
 */
const config = require('config');
const {
  acceptedProgramCodes,
  acceptedKeywords,
  acceptedFormat,
  ignoredNames
} = require('../constants');
const _ = require('lodash');
const rp = require('request-promise');
const fs = require('fs');
const readline = require('readline');

const { Observable } = require('rxjs/Observable');

// patch Observable with appropriate methods
require('rxjs/add/observable/fromEvent');
require('rxjs/add/operator/takeUntil');

/**
 * Get available data sets
 */
function* getAvailableDatasets() {
  const datasets = yield rp(config.dataset_url, { json: true });
  const filteredDatasets = [];
  _.each(_.uniqBy(datasets.dataset, 'identifier'), (entry) => {
    if (
      _.intersection(entry.programCode, acceptedProgramCodes).length > 0
      && _.intersection(entry.keyword, acceptedKeywords).length > 0
      && _.find(entry.distribution, d => d.format === acceptedFormat)
    ) {
      // Check if should ignore this entry
      let shouldIgnore = false;
      _.each(ignoredNames, (name) => {
        if (_.includes(entry.title.toLowerCase(), name.toLowerCase())) {
          shouldIgnore = true;
        }
      });
      const data = {
        downloadURL: _.find(entry.distribution, d => d.format === acceptedFormat).downloadURL,
        title: entry.title
      };
      if (data.downloadURL && !shouldIgnore) filteredDatasets.push(data);
    }
  });

  return filteredDatasets;
}

/**
 * Download and save dataset
 * @param {string} url - The dataset URL
 */
function* downloadDataset(url) {
  const csvStr = yield rp(url);
  yield new Promise((resolve, reject) => {
    // Create directory if not exists
    if (!fs.existsSync(`${config.downloadPath}`)) {
      fs.mkdirSync(`${config.downloadPath}`);
    }
    // Save file to configured directory
    fs.writeFile(`${config.downloadPath}/${url.split('/')[url.split('/').length - 1]}`, csvStr, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Read CSV using Observable.
 * @param {string} path - The file path
 */
function readCSV(path) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path, { highWaterMark: 1024 }),
    historySize: 0,
    terminal: false
  });

  return Observable.create((observer) => {
    rl.on('line', (line) => { observer.next(line); })
      .on('close', () => observer.complete());
  });
}

/**
 * Get array with file names in given directory
 * @param {string} directory - The target directory
 */
function getFilenames(directory) {
  const fileNames = [];
  // Get available files
  fs.readdirSync(directory).forEach((file) => {
    if (file.toLowerCase().endsWith('.csv')) {
      fileNames.push(file);
    }
  });

  return fileNames;
}

module.exports = {
  getAvailableDatasets,
  downloadDataset,
  readCSV,
  getFilenames
};
