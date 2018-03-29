# VA ONLINE MEMORIAL - MONOREPO

## Prerequisites

- NodeJS 8.9
- [Lerna](https://github.com/lerna/lerna). Install Lerna globally by running `npm i -g lerna`

## Using the monorepo

-   Run `lerna bootstrap` to install all dependencies in all packages.
-   Follow the *README.md* in each package to use it.
-   Each package has it's own configuration located in `/packages/<package>/config/default.js`.

## Available packages

### @va/models

Source: `/packages/va-models`
Description: Shared Sequelize models.

### @va/data-scraper

Source: `/packages/va-data-scraper`
Description: VA Online Memorial - Data import & sync tool

### @va/rest-api

Source: `/packages/va-rest-api`
Description: VA Online Memorial - REST API

## Run lint check in all packages

-   Run `lerna run lint` to run the lint test in all packages.
