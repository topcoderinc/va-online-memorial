'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Application constants
 */

const UserRoles = [
  'admin',
  'ro'
];

const Passports = {
  jwt: 'jwt-bearer'
};

const DefaultRole = 'ro';

const DefaultPagination = {
  limit: 10,
  offset: 0
};

module.exports = {
  UserRoles,
  Passports,
  DefaultRole,
  DefaultPagination
};
