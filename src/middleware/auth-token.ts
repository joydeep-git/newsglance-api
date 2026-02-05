import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCode, TokenCreateResponseType } from "@/types/index";
import { errRes, errRouter } from "@/error-handlers/error-responder";
import authRedis from "@/services/redis-service/auth-redis";
import { UserDataType } from "@/types/auth-types";
import authQueries from "@/prisma-utils/auth-queries";



class AuthToken {


  public cookieGenerator(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "72h"
    });
  }

  public cookieConfig(days: number = 3): TokenCreateResponseType {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 * days, // 72hr
    }
  }


  public async validator(req: Request, res: Response, next: NextFunction) {

    try {

      const token: string = req.cookies.token || req.headers.cookie?.split("=")[1] || req.headers.authorization?.split(" ")[1];

      if (!token) return next(errRes("No Active Session! Please Login!", StatusCode.UNAUTHORIZED));

      const blacklistedToken = await authRedis.getBlacklistedToken(token);

      if (blacklistedToken) return res.clearCookie("token").status(StatusCode.UNAUTHORIZED).json({
        message: "Session expired! Please Login"
      })

      // decode token
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;

      let user: UserDataType | null = await authRedis.getUserData(id);

      if (!user) {

        user = await authQueries.findUser({ type: "id", value: id, getPassword: true });

      }

      if (!user) {

        return next(errRes("No User found! Please sign in", StatusCode.NOT_FOUND));

      } else {

        await authRedis.setUserData(user);

        req.user = user;
        req.token = token;

        next();

      }

    } catch (err) {

      return next(errRouter(err));

    }


  }

}

const authToken = new AuthToken();

export default authToken;