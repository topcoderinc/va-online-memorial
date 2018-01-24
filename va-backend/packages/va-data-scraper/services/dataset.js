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
const csv = require('csv-parse');
const _ = require('lodash');
const rp = require('request-promise');
const fs = require('fs');

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
 * Read CSV file
 * @param {string} path - The file path
 */
function* readCSV(path) {
  return yield new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err);
      csv(data, { relax_column_count: true, relax: true, skip_empty_lines: true }, (parsingError, rows) => {
        if (parsingError) return reject(parsingError);
        data = null;
        resolve(rows);
      });
    });
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
    fileNames.push(file);
  });

  return fileNames;
}

module.exports = {
  getAvailableDatasets,
  downloadDataset,
  readCSV,
  getFilenames
};
