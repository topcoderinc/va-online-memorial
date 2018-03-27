'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */
const _ = require('lodash');
const { PostTypes } = require('../constants');

/*
 * Post salute model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('PostSalute', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.BIGINT, allowNull: false },
  postType: { type: DataTypes.ENUM, allowNull: false, values: _.values(PostTypes) },
}, {});
