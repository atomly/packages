export default {
  //
  // ORM
  //
  // Only synchronize the database in development or test
  // to avoid potential loss of data.
  synchronize: (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ),
  logging: false,
  entities: [
    `${__dirname}/entity/**/*.ts`,
  ],
  migrations: [
    `${__dirname}/migration/**/*.ts`,
  ],
  subscribers: [
    `${__dirname}/subscriber/**/*.ts`,
  ],
  cli: {
    entitiesDir: `${__dirname}/entity`,
    migrationsDir: `${__dirname}/migration`,
    subscribersDir: `${__dirname}/subscriber`,
  },
}
