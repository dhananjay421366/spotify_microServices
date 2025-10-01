import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-12515.c61.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 12515,
  },
});

export { redisClient };
