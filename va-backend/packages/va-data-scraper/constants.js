'use strict';

/*
 * Copyright (c) 2018 Topcoder, Inc. All rights reserved.
 */

/**
 * Application constants
 */

// The accepted program codes
const acceptedProgramCodes = [
  '029:001'
];

// The accepted keywords
const acceptedKeywords = [
  'burial data'
];

// The accepted file format
const acceptedFormat = 'csv';

// Entry names that should be ignored
const ignoredNames = [
  // Source of cemeteries data
  'VA Cemeteries - Address, Location, Contact Information, Burial Space'
];

// CSV headers
const csvHeaders = [
  'd_first_name',
  'd_mid_name',
  'd_last_name',
  'd_suffix',
  'd_birth_date',
  'd_death_date',
  'section_id',
  'row_num',
  'site_num',
  'cem_name',
  'cem_addr_one',
  'cem_addr_two',
  'city',
  'state',
  'zip',
  'cem_url',
  'cem_phone',
  'relationship',
  'v_first_name',
  'v_mid_name',
  'v_last_name',
  'v_suffix',
  'branch',
  'rank',
  'war'
];

module.exports = {
  acceptedProgramCodes,
  acceptedKeywords,
  acceptedFormat,
  ignoredNames,
  csvHeaders
};
