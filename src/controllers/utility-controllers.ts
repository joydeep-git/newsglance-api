import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/types";
import { errRes, errRouter } from "@/error-handlers/error-responder";
import db from "@/prisma-utils/db-client";
import { isValidEmail, otpGenerator } from '@/utils/helper-functions';
import authQueries from '@/prisma-utils/auth-queries';
import emailVerificationService from "@/services/email-service/email-service";
import authRedis from "@/services/redis-service/auth-redis";
import { defaultAvatarUrl } from "@/utils/constants";


class UtilityControllers {


  // generate otp for all
  public async generateOtp(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, type } = req.body;


      // verify email
      if (!isValidEmail(email)) return next(errRes("Please enter a valid email!", StatusCode.BAD_REQUEST));

      
      // checking if "login", "signup" given as type or not
      if ( type === "" || !type || type.length <= 0 ) return next(errRes("Type can not be empty!", StatusCode.BAD_REQUEST));


      // check if account exists
      const user = await authQueries.findUser({ value: email, type: "email", getPassword: true });


      // checking what kind of response is it and response to user
      switch (type) {

        case "register":
          if (user)  return next(errRes("Account already exists! Please login.", StatusCode.CONFLICT));
          break;

        case "login":
        case "forget-password":
        case "delete-account":
          if (!user) return next(errRes("No account found!", StatusCode.NOT_FOUND));
          break;

        default:
          return next(errRes("Invalid type!", StatusCode.BAD_REQUEST));

      }



      // create OTP
      const otp = otpGenerator();


      // sending OTP
      const emailResponse = await emailVerificationService.sendOtp({ email, otp, type });



      // if email sent successfully
      if (emailResponse.accepted.length > 0) {


        // storing OTP for validation
        await authRedis.setOtp({ email, otp, type });


        // storing user data in redis
        if (user) await authRedis.setUserData(user);

        // FINAL
        return res.status(StatusCode.OK).json({
          message: "Check your mail box for OTP!"
        })

      } else {
        return next(errRes("Unable to send OTP! Please try again", StatusCode.INTERNAL_SERVER_ERROR));
      }

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async test(_: Request, res: Response) {
    res.status(StatusCode.OK).json({ status: StatusCode.OK, message: "Server is Live!" });
  }


  // reset limit of users free tiers
  public async resetLimit(_: Request, res: Response) {

    try {

      await db.user.updateMany({
        where: {
          planExpiryDate: {
            gte: new Date()
          }
        },
        data: {
          newsBalance: 2,
          audioBalance: 2
        },
      });


      
      return res.status(StatusCode.OK).json({
        message: "Limit restored!"
      })

    } catch (err) {
      throw err;
    }
  }


  public async uploadDefaultImage(req: Request, res: Response, next: NextFunction) {

    try {

      const file = await db.file.create({
        data: {
          url: defaultAvatarUrl,
          type: "image",
          fileSize: 259,
          name: "defaut.jpg",
          isDefaultFile: true,
        }
      });

      return res.status(StatusCode.OK).json({
        message: "File uploaded!",
        data: file,
      });

    } catch (err) {
      return next(errRouter(err));
    }
  }

}

const utilityControllers = new UtilityControllers();

export default utilityControllers;