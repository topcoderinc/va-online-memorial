'use strict';

/*
 * Copyright (C) 2018 Topcoder Inc., All Rights Reserved.
 */

/**
 * This module contains the winston logger configuration.
 */
const winston = require('winston');
const config = require('config');
const chalk = require('chalk');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.logLevel,
      timestamp: () => new Date().toISOString(),
      formatter(options) {
        const message = options.message || '';

        let meta = '';
        if (options.meta && Object.keys(options.meta).length) {
          meta = '\n\t' + JSON.stringify(options.meta);
        }

        let level = options.level.toUpperCase();
        switch (level) {
          case 'INFO':
            level = chalk.cyan(level);
            break;
          case 'WARN':
            level = chalk.yellow(level);
            break;
          case 'ERROR':
            level = chalk.red(level);
            break;
          default:
            break;
        }

        return `[${options.timestamp()}][${level}] ${message} ${meta}`;
      }
    })
  ]
});

module.exports = logger;
