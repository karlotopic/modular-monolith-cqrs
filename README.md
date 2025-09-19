## Description

Numa Senior software engineer take home project.

TO DO: Expand the Readme file

## Project setup

```bash
$ npm install
```

To spin up the database:

```bash
$ docker compose up
```

Sync the prisma schema file with the database:

```bash
$ npx prisma db push
```

Generate prisma client:

```bash
$ npx prisma generate client
```

Seed the database:

```bash
$ npx prisma db seed
```

Prisma is used as a preferred ORM.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
