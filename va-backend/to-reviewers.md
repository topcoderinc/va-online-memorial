
# Quite Guide

- create an empty database in Postgresql
- update packages/va-models/config/default.json and packages/va-rest-api/config/default.json, update the db_url
  to point to the empty database
- `npm i -g lerna`
- `lerna bootstrap`
- `lerna run lint`
- go to packages/va-rest-api folder, run `npm run init-data`, then `npm start`
- check the API with Postman collection and environment in packages/va-rest-api/docs


# Notes

- the BadgeAlsoAddedByUsers table is not needed and of bad practice IMO, instead, front end can search all badges of a veteran,
  this will get all users (via createdBy field) adding the badge to the veteran,
  then front end can render the text like:
  the badge is added by first user, also added by rest (second to last) users

- the initiateForgotPassword will print forgot password token to back end console, the token can be used in
  the changeForgotPassword API

- it is confirmed in forum that the scraper is out of scope

- for Postman tests, when creating/updating Veteran/NextOfKin/Photo, some files params are used, you can select any files

- updated swagger file is at architecture/va-memorial-api-swagger.yaml

