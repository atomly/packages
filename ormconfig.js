module.exports = {
  type: "postgres",
  // The process.env.TYPEORM_HOST parameter
  // come from a .env file.
  // README.md for more info.
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: "postgres",
  password: "password",
  database: "test"
}
