import dotenv from 'dotenv';
import Redis from "ioredis";

class RedisService {

  protected redis: Redis;

  private redisUrl: string;

  constructor() {

    dotenv.config();

    this.redisUrl = process.env.REDIS_URL!;

    this.redis = new Redis(this.redisUrl);

    this.redis.on("connect", () => console.log("Redis Connected on", this.redisUrl));

    this.redis.on("error", (err) => console.log("Redis Connection Error", this.redisUrl, ` Error: ${err}`));

  }

}

export default RedisService;
