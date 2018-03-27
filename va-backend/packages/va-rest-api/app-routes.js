'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * This configuration of passport for express App.
 */
const _ = require('lodash');
const glob = require('glob');
const Path = require('path');
const multer = require('multer');
const config = require('config');
const passport = require('passport');
const { ForbiddenError, UnauthorizedError } = require('./common/errors');
const helper = require('./common/helper');

const upload = multer({ dest: './public/upload' });

/**
 * Configure routes for express
 * @param app the express app
 */
module.exports = (app) => {
  // load all routes.js in modules folder.
  glob.sync(Path.join(__dirname, './modules/**/routes.js'))
    .forEach((routes) => {
      /* Load all routes */
      _.each(require(Path.resolve(routes)), (verbs, path) => {
        _.each(verbs, (def, verb) => {
          const controllerPath = Path.join(Path.dirname(routes), `./controllers/${def.controller}`);
          const method = require(controllerPath)[def.method];
          if (!method) {
            throw new Error(`${def.method} is undefined`);
          }
          const actions = [];
          actions.push((req, res, next) => {
            req.signature = `${def.controller}#${def.method}`;
            next();
          });
          // authenticate by passport if exists auth in definition of routes.
          if (def.auth) {
            actions.push((req, res, next) => {
              passport.authenticate(def.auth, (err, user) => {
                if (err || !user) {
                  next((err instanceof UnauthorizedError) ? err : new UnauthorizedError());
                } else {
                  req.logIn(user, (error) => {
                    next(error);
                  });
                }
              })(req, res, next);
            });

            actions.push((req, res, next) => {
              if (!req.user) {
                next(new UnauthorizedError('Action is not allowed for anonymous!'));
              }
              if (Array.isArray(def.access) &&
                (!req.user.role || _.indexOf(def.access, req.user.role) === -1)) {
                next(new ForbiddenError('You are not allowed to perform this action!'));
              } else {
                next();
              }
            });
          }
          if (def.file) {
            actions.push(upload.any());
          }
          actions.push(method);
          app[verb](`/api/${config.version}${path}`, helper.autoWrapExpress(actions));
        });
      });
    });
};
