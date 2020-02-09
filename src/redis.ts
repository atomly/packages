// Libraries
import Redis from "ioredis";

// TODO: Add redis URL to .env variables
// Connect to 127.0.0.1:6379, db "redis", using password "authpassword":
// Ex: "redis://:authpassword@127.0.0.1:6379/redis"
// NOTE: For this to work, make sure request credentials is set up correctly
// in the playground: "request.credentials": "include"
export const redis = new Redis({
  port: 6379, // Redis port
  host: 'localhost', // Redis host - TODO: Add to .env
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: 'password',
  db: 0,
});
