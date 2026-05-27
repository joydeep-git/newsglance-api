import { Redis } from "ioredis";
import redisService from "./redis.js";
import { FuelCustomResponseType } from "@/types/index.js";


class UtilityRedis {


  private redis: Redis = redisService.redis;


  public async setFuelPrice(data: FuelCustomResponseType[]): Promise<void> {

    await this.redis.set("fuel-price", JSON.stringify(data)); // lifetime bcz if api fails it will stay

  }


  public async getFuelPrice(): Promise<FuelCustomResponseType[] | null> {

    const data = await this.redis.get("fuel-price");

    if (data) return JSON.parse(data);

    else return null;

  }


}

const utilityRedis = new UtilityRedis();

export default utilityRedis;