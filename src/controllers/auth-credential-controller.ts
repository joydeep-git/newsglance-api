import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import db from "../prisma-utils/db-client";
import authQueries from "../prisma-utils/auth-queries";
import authRedis from "../redis-service/auth-redis";
import { StatusCode } from '../types/index';
import { NextFunction, Request, Response } from "express";
import { fieldValidator, isValidEmail } from "../utils/helper-functions";
import { errRes, errRouter } from "../error-handlers/error-responder";


class AuthCredentialControllers {


  // register account + verify OTP
  public async register(req: Request, res: Response, next: NextFunction) {

    try {

      const { username, name, email, password, otp } = await req.body;


      // check missing fields
      const missingField = fieldValidator(["username", "name", "email", "password", "otp"], req);

      if (missingField) return next(errRes(`${missingField} is required!`, StatusCode.BAD_REQUEST));


      // check if username exists
      const existingUsername = await authQueries.findUser({ value: username, type: "username" });

      if (existingUsername) {
        return next(errRes("Username already exists!", StatusCode.CONFLICT));
      }


      // check email for account and validity
      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const existingEmail = await authQueries.findUser({ value: email, type: "email" });

      if (existingEmail) {
        return next(errRes("Email already exists!", StatusCode.CONFLICT));
      }


      // check otp validation
      const otpVerified = await authRedis.verifyOtp({ email, otp, type: "register" });

      if (!otpVerified) return next(errRes("Incorrect OTP!", StatusCode.BAD_REQUEST));

      const hashedPassword = await argon2.hash(password);

      // create user
      const newUser = await db.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        }
      });

      return res.status(StatusCode.OK).json({
        message: "Account created!",
        data: newUser
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }



  // Login + verify OTP
  public async login(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, password, otp } = await req.body;

      // check missing fields
      const missingField = fieldValidator(["email", "password", "otp"], req);

      if (missingField) return next(errRes(`${missingField} is required!`, StatusCode.BAD_REQUEST));


      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));


      const otpVerified = authRedis.verifyOtp({ email, otp, type: "login" });

      if (!otpVerified) return next(errRes("Incorrect OTP!", StatusCode.UNAUTHORIZED));

      const user = await db.user.findUnique({
        where: {
          email
        }
      });

      if (!user) return next(errRes("No Account Found!", StatusCode.BAD_REQUEST));

      const isSamePassword = await argon2.verify(user.password, password);

      if (!isSamePassword) return next(errRes("Wrong Password!", StatusCode.UNAUTHORIZED));


      // create token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "72h"
      });

      if (!token) return next(errRes("Unable to login! Please try again.", StatusCode.INTERNAL_SERVER_ERROR));

      return res.status(StatusCode.OK)
        .cookie("TOKEN", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 72 * 60 * 60 * 1000, // 72hr
        })
        .json({
          message: "Logged in successfully!",
          data: user
        })

    } catch (err) {

      return next(errRouter(err));

    }

  }


  public async logout(req: Request, res: Response, next: NextFunction) {

    try {

      const token: string = req.cookies.token || req.headers.authorization?.split(" ")[1];

      await authRedis.setBlacklistedToken(token);

      return res.status(StatusCode.OK).json({
        message: "Logged Out!",
      })

    } catch (err) {

      return next(errRouter(err));

    }

  }


  public async deleteAccount(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, password, otp } = await req.body;

      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const isSamePassword = await argon2.verify(req.user.password, password);

      if (!isSamePassword) return next(errRes("Incorrect Password!", StatusCode.UNAUTHORIZED));


      const isValidOtp = await authRedis.verifyOtp({ email, otp, type: "delete-account" });

      if (!isValidOtp) return next(errRes("Incorrect OTP!", StatusCode.BAD_REQUEST));


      const response = await db.user.delete({
        where: {
          id: req.user.id,
          email
        }
      })

      if (response) {

        await authRedis.deleteUserData(req.user.id);

        return res.clearCookie("token").status(StatusCode.OK).json({
          message: "Account Deleted!"
        })

      } else {

        return next(errRes("Unable to delete account!", StatusCode.INTERNAL_SERVER_ERROR));

      }

    } catch (err) {

      return next(errRouter(err));

    }

  }


  public async forgetPassword(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, otp, password } = await req.body;

      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const isVerified = await authRedis.verifyOtp({ email, otp, type: "forget-password" });

      if (!isVerified) return next(errRes("Incorrect OTP", StatusCode.UNAUTHORIZED));

      const hashPass = await argon2.hash(password);

      const update = await authQueries.updateSingleValue({ userId: req.user.id, field: "password", value: hashPass });

      if (update) {

        return res.status(StatusCode.OK).json({
          message: "Password Changed!"
        })

      } else {
        return next(errRes("Unable to change password!", StatusCode.INTERNAL_SERVER_ERROR));
      }

    } catch (err) {
      return next(errRouter(err));
    }

  }

}

const authCredentialControllers = new AuthCredentialControllers();

export default authCredentialControllers;