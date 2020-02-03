module.exports = {
  //
  // DB Connection
  //
  // The process.env variables come from a .env file.
  // README.md for more info.
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  //
  // ORM
  //
  // Only synchronize the database in development to avoid
  // potential loss of data.
  synchronize: Boolean(process.env.NODE_ENV === 'development'),
  logging: false,
  entities: [
    "src/entity/**/*.ts"
  ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  subscribers: [
    "src/subscriber/**/*.ts"
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
}
