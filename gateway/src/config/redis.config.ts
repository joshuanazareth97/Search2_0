import { createClient } from "redis";

const { REDIS_HOST, REDIS_PORT } = process.env;

export const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
