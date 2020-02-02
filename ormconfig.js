module.exports = {
  //
  // DB Connection
  //
  type: "postgres",
  // The process.env.TYPEORM_HOST parameter
  // come from a .env file.
  // README.md for more info.
  host: 'localhost',
  port: 5432,
  username: "postgres",
  password: "password",
  database: "test",
  //
  // ORM
  //
  synchronize: true,
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
