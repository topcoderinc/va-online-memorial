'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Notification preference model definition
 */
module.exports = (sequelize, DataTypes) => sequelize.define('NotificationPreference', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  storyNotificationsSite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  storyNotificationsEmail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  storyNotificationsMobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  badgeNotificationsSite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  badgeNotificationsEmail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  badgeNotificationsMobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  testimonialNotificationsSite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  testimonialNotificationsEmail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  testimonialNotificationsMobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  photoNotificationsSite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  photoNotificationsEmail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  photoNotificationsMobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  eventNotificationsSite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  eventNotificationsEmail: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  eventNotificationsMobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  timestamps: false
});
