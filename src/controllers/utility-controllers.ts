import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../types/index.js";
import { errRes, errRouter } from "../errors/error-responder.js";
import { isValidEmail, otpGenerator } from '../utils/helpers.js';
import authQueries from '../prisma-utils/auth-queries.js';
import emailService from "../services/email/brevo.js";
import authRedis from "../services/redis/auth-redis.js";
import userQueries from "../prisma-utils/user-queries.js";
import db from "@/prisma-utils/db-client.js";


class UtilityControllers {


  // generate otp for all
  public async generateOtp(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, type } = req.body;


      // verify email
      if (!isValidEmail(email)) return next(errRes("Please enter a valid email!", StatusCode.BAD_REQUEST));


      // checking if "login", "signup" given as type or not
      if (type === "" || !type || type.length <= 0) return next(errRes("Type can not be empty!", StatusCode.BAD_REQUEST));


      // check if account exists
      const user = await authQueries.findUser({ value: email, type: "email", getPassword: true });


      // checking what kind of response is it and response to user
      switch (type) {

        case "register":
          if (user) return next(errRes("Account already exists! Please login.", StatusCode.CONFLICT));
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
      const emailResponse = await emailService.sendOtp({ email, otp, type });



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


  public test(_: Request, res: Response) {
    res.status(StatusCode.OK).json({ status: StatusCode.OK, message: "Server is Live!" });
  }


  // reset limit of users free tiers
  public async resetLimit(_: Request, res: Response) {

    await userQueries.resetLimit();

    return res.status(StatusCode.OK).json({
      message: "Limit restored!"
    });

  }


  // contact us page data
  public async contactUs(req: Request, res: Response) {

    try {

      await emailService.contactMeEmail(req.body);

      return res.status(StatusCode.OK).json({
        message: "Message sent to Newsglance Team!"
      });

    } catch (err) {
      throw errRes("Unable to send message! Please try again", StatusCode.SERVICE_UNAVAILABLE);
    }

  }


  public async checkDb(req: Request, res: Response, next: NextFunction) {

    const { password } = req.params;

    if (password !== process.env.ADMIN_PASSWORD) return next(errRes("Invalid password!", StatusCode.UNAUTHORIZED));

    const data = db.$transaction(async (tx) => {

      const obj: Record<string, Object> = {};

      obj["user"] = tx.user.findMany();
      obj["file"] = tx.file.findMany();
      obj["bookmark"] = tx.bookmark.findMany();
      obj["payment"] = tx.payment.findMany();
      obj["newsData"] = tx.newsData.findMany();

      return obj;
    })

    return res.status(StatusCode.OK).json({
      message: "Data fetched successfully!",
      data
    });

  }

}

const utilityControllers = new UtilityControllers();

export default utilityControllers;