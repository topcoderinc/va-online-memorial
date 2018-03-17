# VA ONLINE MEMORIAL - DATA IMPORT & SYNC

## Dependencies
-   [Nodejs](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [eslint](http://eslint.org/)

## Configuration
-   Edit configuration in `config/default.json` and
-   custom environment variables names in `config/custom-environment-variables.json`,

## Application constants

-   Application constants can be configured in `./constants.js`

## Available tools

-   Since the data we need to download and process is huge it's better (/ safer) to use 2 different tools instead of one single script so in case that something goes wrong during processing, we'll minimise the damage.

### Download datasets

-   Run `npm run download-data` to download all available datasets.
-   The datasets will be stored in the configured directory.
-   Old data will be replaced.
-   This operation does not affect the database.

### Import data from downloaded files

-   Run `npm run import-data` to import all data using the downloaded files from the previous step.

## Local Deployment

*Before starting the application, make sure that PostgreSQL is running and you have configured everything correctly in `config/default.json`*

-   Install dependencies `npm i`
-   Run lint check `npm run lint`
-   Start scraper `npm run scrape`. This will run all tools in the following sequence:

`npm run download-data` => `npm run import-data`

*The application will print progress information and the results in the terminal.*

## Verification

-   To verify that the data is imported, you can use the [pgAdmin](https://www.pgadmin.org/) tool and browser the database.

## Notes:

-   The total size of all datasets is > 1.5GB so it will take quite some time, depending on your internet connection, to finish the operation.
-   `max_old_space_size` has been set to *4096MB* to allow parse/process such huge data files without any issues. The app will clean the memory right after using the data to prevent memory/heap leaks.
-   The dataset for `FOREIGN ADDRESSES` doesn't have a header in the CSV file and it has slightly different format (it has an extra column). The app handles all datasets without any issue.
