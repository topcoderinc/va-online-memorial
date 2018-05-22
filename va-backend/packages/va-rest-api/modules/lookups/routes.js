'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/*
 * Contains all routes.
 */


module.exports = {
  '/branches': {
    get: {
      controller: 'LookupController',
      method: 'getBranches'
    }
  },
  '/ranks': {
    get: {
      controller: 'LookupController',
      method: 'getRanks'
    }
  },
  '/wars': {
    get: {
      controller: 'LookupController',
      method: 'getWars'
    }
  },
  '/countries': {
    get: {
      controller: 'LookupController',
      method: 'getCountries'
    }
  },
  '/cemeteries': {
    get: {
      controller: 'LookupController',
      method: 'getCemeteries'
    }
  },
  '/badgeTypes': {
    get: {
      controller: 'LookupController',
      method: 'getBadgeTypes'
    }
  },
  '/eventTypes': {
    get: {
      controller: 'LookupController',
      method: 'getEventTypes'
    }
  },
  '/campaigns': {
    get: {
      controller: 'LookupController',
      method: 'getCampaigns'
    }
  }
};
