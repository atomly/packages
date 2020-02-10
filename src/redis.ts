// Libraries
import Redis from "ioredis";

// TODO: Add redis settings to the ENV variables file.
// Connect to 127.0.0.1:6379, db "redis", using password "authpassword":
// Ex: "redis://:authpassword@127.0.0.1:6379/redis"
// NOTE: For this to work, make sure the request credentials setting is
// set up correctly in the playground: "request.credentials": "include".
export const redis = new Redis({
  port: 6379, // Redis port
  host: 'localhost', // Redis host - TODO: Add to .env
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: 'password',
  db: 0,
});
