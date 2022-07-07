# Northcoders News API

Solo project for the backend section of the Northcoders Web Development Bootcamp.

## Hosted

A hosted version of this project can be found [here.](https://nc-news-ae-solo.herokuapp.com/api)

## API

This API exposes a number of endpoints to retrieve data from a persistent data source. It's written in JavaScript, using Node.js and express for the backend alongside PostgreSQL. A testing suite, which utilises [Jest](https://www.npmjs.com/package/jest), is also included.

**For a full list of available endpoints, see [here.](https://nc-news-ae-solo.herokuapp.com/api)**

## Cloning

Fork and clone this repo, and then:

1.  run `npm install` in order to install all of the required dependencies.
2.  Create two .env files in the root directory:

    > **.env.development** Populate with '_PGDATABASE=<name_of_your_db>_'

    > **.env.test** Populate with '_PGDATABASE=<name_of_your_db>\_test_'

3.  Run `npm run setup-dbs` to create two separate databases, one for development and one for testing.
4.  Run `npm run seed` to seed the development database. The test database will seed automatically every time a test runs. This should work fine providing your .env files are setup correctly.
5.  Run `npm run prepare` in order to set-up husky.
6.  Tests can be run using `npm test` to run the entire test suite, or with `npm test <path_to_file>` which will run a single, specified testing file.
7.  Once you're ready to deploy to Heroku, run `npm run seed:prod`. This will seed the production database, but must be done **after** the PostgreSQL addon has been added to Heroku. Heroku will automatically provide a database url to connect to.

## Versions

This project was developed using version 18.1.0 of Node, and version 8.7.3 of [node-postgres](https://www.npmjs.com/package/pg)
