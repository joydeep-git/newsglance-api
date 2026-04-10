import { Redis } from "ioredis";
import redisService from "./redis.js";
import { FuelPriceResponseType, fuelRedisType } from "@/types/index.js";


class UtilityRedis {


  private redis: Redis = redisService.redis;


  public async setFuelPrice({ type, data }: fuelRedisType ): Promise<void> {

    await this.redis.setex(`fuel:${type}`, 43200, JSON.stringify(data) ); // 12 hr

  }


  public async getFuelPrice(type: "petrol" | "diesel"): Promise<FuelPriceResponseType[] | null> {

    const data = await this.redis.get(`fuel:${type}`);

    if (data) return JSON.parse(data);

    else return null;

  }


}

const utilityRedis = new UtilityRedis();

export default utilityRedis;