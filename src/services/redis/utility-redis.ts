import { Redis } from "ioredis";
import redisService from "./redis.js";
import { FuelCustomResponseType } from "@/types/index.js";


class UtilityRedis {


  private redis: Redis = redisService.redis;


  public async setFuelPrice(data: FuelCustomResponseType[]): Promise<void> {

    await this.redis.setex("fuel-price", 43200, JSON.stringify(data)); // 12 hr

  }


  public async getFuelPrice(): Promise<FuelCustomResponseType[] | null> {

    const data = await this.redis.get("fuel-price");

    if (data) return JSON.parse(data);

    else return null;

  }


}

const utilityRedis = new UtilityRedis();

export default utilityRedis;