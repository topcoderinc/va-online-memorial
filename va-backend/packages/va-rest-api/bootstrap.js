/**
 * Copyright (C) 2018 TopCoder Inc., All Rights Reserved.
 */

/**
 * Bootstrap.
 *
 * @author      TCSCODER
 * @version     1.0
 */

const Joi = require('joi');
const constants = require('./constants');

Joi.id = () => Joi.number().integer().min(1).required();
Joi.optionalId = () => Joi.number().integer().min(1);
Joi.offset = () => Joi.number().integer().min(0).default(constants.DefaultPagination.offset);
Joi.limit = () => Joi.number().integer().min(1).default(constants.DefaultPagination.limit);
Joi.sortOrder = () => Joi.string().valid('asc', 'ASC', 'desc', 'DESC').default('ASC');
