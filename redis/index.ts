// Libraries
import Redis from "ioredis";

// TODO: Add redis settings to the ENV variables file.
// Connect to 127.0.0.1:6379, db "redis", using password "authpassword":
// Ex: "redis://:authpassword@127.0.0.1:6379/redis"
// NOTE: For this to work, make sure the request credentials setting is
// set up correctly in the playground: "request.credentials": "include".
export const redis = new Redis({
  port: process.env.REDIS_PORT as unknown as number, // Redis port
  host: process.env.REDIS_HOST as unknown as string, // Redis host
  family: process.env.REDIS_FAMILY as unknown as number, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_PASSWORD as unknown as string,
  db: process.env.REDIS_DB as unknown as number,
});
