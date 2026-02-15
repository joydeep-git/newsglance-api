import { errorPrinter } from '@/error-handlers/error-responder';
import dotenv from 'dotenv';
import Redis from "ioredis";

class RedisService {

  public redis: Redis;

  private redisUrl: string;

  constructor() {

    dotenv.config();

    this.redisUrl = process.env.REDIS_URL!;

    this.redis = new Redis(this.redisUrl);

    this.redis.on("connect", () => errorPrinter("Redis Connected on", this.redisUrl));

    this.redis.on("error", (err) => errorPrinter("Redis Connection Error", err));

  }

}

const redisService = new RedisService();

export default redisService;
