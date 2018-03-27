'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Contains express application configurations.
 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

require('dotenv').config();
require('./bootstrap');

const cors = require('cors');
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('./common/logger');
const _ = require('lodash');
const { syncDB } = require('@va/models');
const path = require('path');

syncDB();

const app = express();

// static content
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

require('./app-passport')(app);
require('./app-routes')(app);

app.use(passport.initialize());

// The error handler,log error and return 500 error
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logFullError(err, req.signature || `${req.method} ${req.url}`);
  const errorResponse = {};
  const status = (err.isJoi) ? 400 : err.httpStatus || 500;

  if (_.isArray(err.details)) {
    errorResponse.fields = _.map(err.details, 'path').join(', ');
    if (err.isJoi) {
      _.map(err.details, (e) => {
        if (e.message) {
          if (_.isUndefined(errorResponse.message)) {
            errorResponse.message = e.message;
          } else {
            errorResponse.message += ', ' + e.message;
          }
        }
      });
    }
  }
  if (_.isUndefined(errorResponse.message)) {
    if (err.message) {
      errorResponse.message = err.message;
    } else {
      errorResponse.message = 'server error';
    }
  }

  errorResponse.code = status;
  res.status(status).json(errorResponse);
});

// Handle 404
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: 'Page not found'
  });
});

app.listen(config.port, '0.0.0.0');
logger.info('Server listening on port %d in %s mode', config.port, process.env.NODE_ENV);
