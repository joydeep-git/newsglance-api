import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../types";
import authRedis from "../../redis-service/auth-redis";
import { errRes, errRouter } from "../../error-handlers/error-responder";
import { isValidEmail } from "../../utils/helper-functions";
import * as argon2 from "argon2";
import authQueries from "../../prisma-utils/auth-queries";


class AuthGeneralControllers {


  // logout
  public async logout(req: Request, res: Response, next: NextFunction) {

    try {
      const token: string = req.token;

      res.clearCookie("token").status(StatusCode.OK).json({
        message: "Logged Out!",
        statusCode: StatusCode.OK
      });

      await authRedis.setBlacklistedToken(token);

    } catch (err) {
      return next(errRouter(err));
    }
  }


  // delete account + delete OTP
  public async deleteAccount(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, password, otp } = req.body;

      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const isSamePassword = await argon2.verify(req.user.password!, password);

      if (!isSamePassword) return next(errRes("Incorrect Password!", StatusCode.UNAUTHORIZED));

      const isValidOtp = await authRedis.verifyOtp({ email, otp, type: "delete-account" });

      if (!isValidOtp) return next(errRes("Incorrect OTP!", StatusCode.BAD_REQUEST));


      const response = await authQueries.deleteUser({ id: req.user.id, email });

      if (response) {

        res.clearCookie("token").status(StatusCode.OK).json({
          message: "Account Deleted!"
        });

        await authRedis.deleteUserData(req.user.id);

        await authRedis.deleteOtp({ email, type: "delete-account" });

      } else {

        return next(errRes("Unable to delete account!", StatusCode.INTERNAL_SERVER_ERROR));

      }

    } catch (err) {

      return next(errRouter(err));

    }

  }


  // verify token
  public async verifyToken(req: Request, res: Response, next: NextFunction) {

    const user = req.user;

    delete user.password;

    res.status(StatusCode.OK).json({
      message: "User data fetched!",
      data: user
    })

  }

}

const authGeneralControllers = new AuthGeneralControllers();

export default authGeneralControllers;