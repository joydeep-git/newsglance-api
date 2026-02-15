import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/types/index";
import { errRes, errRouter } from "@/error-handlers/error-responder";
import { isValidEmail } from "@/utils/helper-functions";
import * as argon2 from "argon2";
import authQueries from "@/prisma-utils/auth-queries";
import cloudStorage from "@/services/aws-service/s3";
import filesQueries from "@/prisma-utils/files-queries";
import authRedis from "@/services/redis-service/auth-redis";


class AuthGeneralControllers {


  // logout
  public async logout(req: Request, res: Response, next: NextFunction) {

    try {

      const { token } = req;

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


      // get user data
      const fetchUserData = await authQueries.findUser({ type: "email", value: email, getPassword: true })

      if (!fetchUserData) return next(errRes("User not found! ", StatusCode.NOT_FOUND));
      
      
      // verify password
      const isSamePassword = await argon2.verify(fetchUserData?.password!, password);

      if (!isSamePassword) return next(errRes("Incorrect Password!", StatusCode.UNAUTHORIZED));


      // verify OTP
      const isValidOtp = await authRedis.verifyOtp({ email, otp, type: "delete-account" });

      if (!isValidOtp) return next(errRes("Incorrect OTP!", StatusCode.BAD_REQUEST));


      // delete account details

      const deletedAccount = await authQueries.deleteUser({ id: req.user.id, email });

      if (!deletedAccount) {

        return next(errRes("Unable to delete account!", StatusCode.INTERNAL_SERVER_ERROR));

      } else {

        res.clearCookie("token").status(StatusCode.OK).json({
          message: "Account Deleted!"
        });

        try {

          await filesQueries.deleteFileRow({ type: "id", value: req?.user?.avatarId });

          await cloudStorage.deleteFile(req?.user?.avatar?.url!);

          await authRedis.deleteUserData(req?.user?.id);

        } catch {

          null; // stopping sending any error

        }

      }

    } catch (err) {

      return next(errRouter(err));

    }

  }


  // verify token
  public async verifyToken(req: Request, res: Response, next: NextFunction) {

    const user = req.user;

    if (user?.password) delete user.password;

    res.status(StatusCode.OK).json({
      message: "User data fetched!",
      data: user
    })

  }

}

const authGeneralControllers = new AuthGeneralControllers();

export default authGeneralControllers;