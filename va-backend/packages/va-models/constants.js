'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Application constants
 */

const UserRoles = {
  Admin: 'admin',
  User: 'user'
};

const UserStatuses = {
  Active: 'Active',
  Inactive: 'Inactive',
  Blocked: 'Blocked'
};

const Statuses = {
  Requested: 'Requested',
  Approved: 'Approved',
  Rejected: 'Rejected'
};

const FlagStatuses = {
  Requested: 'Requested',
  Processed: 'Processed'
};

const PostTypes = {
  Story: 'Story',
  Photo: 'Photo',
  Badge: 'Badge',
  Testimonial: 'Testimonial'
};

module.exports = {
  UserRoles,
  UserStatuses,
  Statuses,
  FlagStatuses,
  PostTypes
};
