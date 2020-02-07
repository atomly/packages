export default {
  //
  // ORM
  //
  // Only synchronize the database in development or test
  // to avoid potential loss of data.
  synchronize: Boolean(
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test',
  ),
  logging: false,
  entities: [
    `${__dirname}/src/entity/**/*.ts`,
  ],
  migrations: [
    `${__dirname}/src/migration/**/*.ts`,
  ],
  subscribers: [
    `${__dirname}/src/subscriber/**/*.ts`,
  ],
  cli: {
    entitiesDir: `${__dirname}/src/entity`,
    migrationsDir: `${__dirname}/src/migration`,
    subscribersDir: `${__dirname}/src/subscriber`,
  },
}
