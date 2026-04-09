import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../types/index.js";
import { errorPrinter, errRes, errRouter } from "../../errors/error-responder.js";
import { isValidEmail } from "../../utils/helpers.js";
import * as argon2 from "argon2";
import authQueries from "../../prisma-utils/auth-queries.js";
import cloudStorage from "../../services/aws/s3.js";
import filesQueries from "../../prisma-utils/files-queries.js";
import authRedis from "../../services/redis/auth-redis.js";


class AuthGeneralControllers {


  // logout
  public async logout(req: Request, res: Response, next: NextFunction) {

    try {

      const { token } = req;

      await authRedis.setBlacklistedToken(token);

      await authRedis.deleteUserData(req.user.id);

      return res.clearCookie("token").status(StatusCode.OK).json({
        message: "Logged Out!",
        statusCode: StatusCode.OK
      });

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
      const isSamePassword = await argon2.verify(fetchUserData.password as string, password);

      if (!isSamePassword) return next(errRes("Incorrect Password!", StatusCode.UNAUTHORIZED));


      // verify OTP
      const isValidOtp = await authRedis.verifyOtp({ email, otp, type: "delete-account" });

      if (!isValidOtp) return next(errRes("Incorrect OTP!", StatusCode.BAD_REQUEST));


      // delete account details

      const deletedAccount = await authQueries.deleteUser({ id: req.user.id, email });

      if (!deletedAccount) {

        return next(errRes("Delete account failed!", StatusCode.INTERNAL_SERVER_ERROR));

      } else {

        res.clearCookie("token").status(StatusCode.OK).json({
          message: "Account Deleted!"
        });

        try {

          await authRedis.deleteOtp({ type: "delete-account", email });

          await authRedis.setBlacklistedToken(req?.token);

          await filesQueries.deleteFileRow({ type: "id", value: req.user.avatarId });

          await cloudStorage.deleteFile(req.user.avatar.url);

          await authRedis.deleteUserData(req.user.id);

        } catch (err) {

          errorPrinter("Delete Account failed!", err);

        }

      }

    } catch (err) {

      return next(errRouter(err));

    }

  }


  // verify token
  public async verifyToken(req: Request, res: Response) {

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