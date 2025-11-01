import {OtpType, UserDataType} from './../types/auth-types';
import argon2 from 'argon2';
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../types";
import { errRes, errRouter } from "../error-handlers/error-responder";
import ErrorHandler from "../error-handlers/error-handler";
import db from "../prisma-utils/db-client";
import { fieldValidator, isValidEmail, otpGenerator } from '../utils/helper-functions';
import authQueries from '../prisma-utils/auth-queries';
import emailVerificationService from '../email-service/email-service';
import authRedis from '../redis-service/auth-redis';
import jwt, {JwtPayload} from "jsonwebtoken";
import authToken from "../middleware/auth-token";


class UtilityControllers {


  // generate otp for all
  public async generateOtp(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, type } = req.body;

      if (!isValidEmail(email)) return next(errRes("Please enter a valid email!", StatusCode.BAD_REQUEST));

      if ( type === "" || !type || type.length <= 0 ) return next(errRes("Type can not be empty!", StatusCode.BAD_REQUEST));

      const user = await authQueries.findUser({ value: email, type: "email", getPassword: false });

      // checking what kind of response is it
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
          return next(errRes("Invalid OTP type!", StatusCode.BAD_REQUEST));

      }

      // create OTP
      const otp = otpGenerator();

      const emailResponse = await emailVerificationService.sendOtp({ email, otp, type });

      if (emailResponse.accepted.length > 0) {

        await authRedis.setOtp({ email, otp, type });

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
        }
      });

      return res.status(StatusCode.OK).json({
        message: "Limit restored!"
      })

    } catch (err) {
      throw err;
    }
  }

}

const utilityControllers = new UtilityControllers();

export default utilityControllers;