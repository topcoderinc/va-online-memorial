# VA ONLINE MEMORIAL - REST API

## Dependencies
-   [Nodejs](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Express](https://expressjs.com/)
-   [eslint](http://eslint.org/)
-   [Postman](https://www.getpostman.com/) for verification.

## Configuration
-   Edit configuration in `config/default.json` and
-   custom environment variables names in `config/custom-environment-variables.json`,

## Application constants

-   Application constants can be configured in `./constants.js`

## Local Deployment

*Before starting the application, make sure that PostgreSQL is running and you have configured everything correctly in `config/default.json`*

-   Install dependencies `npm i`
-   Run lint check `npm run lint`
-   Initialize database data `npm run init-data`
-   Start the REST API `npm start`.

## Postman Verification

-   To verify the REST API, you can import the collection & environment from `/docs` in [Postman](https://www.getpostman.com/)
