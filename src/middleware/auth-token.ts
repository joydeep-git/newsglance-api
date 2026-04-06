import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCode, TokenCreateResponseType } from "../types/index.js";
import { errRes, errRouter } from "../errors/error-responder.js";
import authRedis from "../services/redis/auth-redis.js";
import { UserDataType } from "../types/auth.js";
import authQueries from "../prisma-utils/auth-queries.js";



class AuthToken {


  public cookieGenerator(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "72h"
    });
  }

  public cookieConfig(days: number = 3): TokenCreateResponseType {
    const isProduction = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 * days, // 72hr
    }
  }


  public async validator(req: Request, res: Response, next: NextFunction) {

    try {

      const token: string = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : "");

      if (!token) return next(errRes("No Active Session! Please Login!", StatusCode.UNAUTHORIZED));


      // checking if token is blacklisted
      const blacklistedToken = await authRedis.getBlacklistedToken(token);

      if (blacklistedToken) {
        return res.clearCookie("token").status(StatusCode.UNAUTHORIZED).json({
          message: "Session expired! Please Login"
        });
      }



      // decode token
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;


      // fetching data from cache
      let user: UserDataType | null = await authRedis.getUserData(id);

      if (!user) {


        // If not in redis then check db
        const response = await authQueries.findUser({ type: "id", value: id, getPassword: false });

        if (!response) {
          return next(errRes("No User found! Please sign in", StatusCode.NOT_FOUND));
        }

        // removing password from res
        if (response?.password) delete response.password;

        user = response;

        await authRedis.setUserData(response);

      }


      req.user = user;

      req.token = token;

      next();

    } catch (err) {

      return next(errRouter(err));

    }


  }

}

const authToken = new AuthToken();

export default authToken;