import { OtpType, UserDataType } from "../types/auth-types";
import RedisService from "./redis-service";

class AuthRedis extends RedisService {


  public async setOtp({ email, otp, type }: { email: string; otp: string; type: OtpType; }) {

    const url: string = `auth:otp:${type}:${email}`;

    await this.redis.setex(url, 600, otp);

  }


  public async deleteOtp({ type, email }: { type: OtpType; email: string; }): Promise<void> {

    await this.redis.del(`auth:otp:${type}:${email}`);

  }


  public async verifyOtp({ type, email, otp }: { type: OtpType; email: string; otp: string; }): Promise<boolean> {

    const existingOtp: string | null = await this.redis.get(`auth:otp:${type}:${email}`);

    return existingOtp === otp;

  }



  public async setBlacklistedToken(token: string): Promise<void> {
    await this.redis.setex(`auth:token:blacklist:${token}`, 259200, token);
  }

  public async getBlacklistedToken(token: string): Promise<boolean> {
    return (await this.redis.get(`auth:token:blacklist:${token}`)) ? true : false;
  }



  public async setUserData(userData: UserDataType): Promise<void> {
    await this.redis.setex(`auth:user:${userData?.id}`, 600, JSON.stringify(userData));
  }


  public async getUserData(userId: string): Promise<UserDataType | null> {

    const data = await this.redis.get(`auth:user:${userId}`);

    if (data) return JSON.parse(data);

    return null;
  }


  public async deleteUserData(userId: string): Promise<void> {
    await this.redis.del(`auth:user:${userId}`);
  }

}


const authRedis = new AuthRedis();

export default authRedis;