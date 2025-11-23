import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "../../error-handlers/error-responder";
import authToken from "../../middleware/auth-token";
import authQueries from "../../prisma-utils/auth-queries";
import authRedis from "../../redis-service/auth-redis";
import { StatusCode } from '../../types';
import { UserDataType } from "../../types/auth-types";
import { fieldValidator, isValidEmail } from "../../utils/helper-functions";


class AuthCredentialControllers {


  // register account + verify OTP
  public async register(req: Request, res: Response, next: NextFunction) {

    try {

      const { username, email, otp } = req.body;


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

      // create user
      const newUser: UserDataType = await authQueries.createNewUser({ req });

      res.status(StatusCode.OK).json({
        message: "Account created!",
        data: newUser
      });

      return await authRedis.deleteOtp({ email, type: "register" });

    } catch (err) {
      return next(errRouter(err));
    }

  }


  // Login + verify OTP
  public async login(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, password, otp } = req.body;

      // check missing fields
      const missingField = fieldValidator(["email", "password", "otp"], req);

      if (missingField) return next(errRes(`${missingField} is required!`, StatusCode.BAD_REQUEST));

      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const otpVerified = await authRedis.verifyOtp({ email, otp, type: "login" });

      if (!otpVerified) {
        return next(errRes("Incorrect OTP!", StatusCode.UNAUTHORIZED));
      }

      let user: UserDataType | null = await authRedis.getUserData(email);

      if (!user) user = await authQueries.findUser({ type: "email", value: email, getPassword: true });

      if (!user) return next(errRes("No Account Found!", StatusCode.BAD_REQUEST));

      const isSamePassword = await argon2.verify(user.password!, password);

      if (!isSamePassword) return next(errRes("Incorrect Password!", StatusCode.UNAUTHORIZED));


      // create token
      const token = authToken.cookieGenerator(user.id);

      if (!token) return next(errRes("Unable to login! Please try again.", StatusCode.INTERNAL_SERVER_ERROR));

      const userWithoutPassword = { ...user };

      delete userWithoutPassword.password;

      res
        .status(StatusCode.OK)
        .cookie("token", token, authToken.cookieConfig())
        .json(
          {
            message: "Logged in successfully!",
            data: userWithoutPassword,
          }
        )

      return await authRedis.deleteOtp({ email, type: "login" });

    } catch (err) {

      return next(errRouter(err));

    }

  }


  // forget password + delete OTP
  public async forgetPasswordUpdate(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, otp, password } = req.body;

      if (!isValidEmail(email)) return next(errRes("Invalid Email!", StatusCode.BAD_REQUEST));

      const verified = await authRedis.checkPasswordReset({ email, otp });

      if (!verified) return next(errRes("OTP unverified or expired!", StatusCode.BAD_REQUEST));

      let user: UserDataType | null = await authRedis.getUserData(email);

      if (!user) user = await authQueries.findUser({ type: "email", value: email, getPassword: false });

      const update = await authQueries.updateSingleValue({ identifier: email, field: "password", value: password });

      if (update) {

        await authRedis.deleteOtp({ email, type: "forget-password" });

        await authRedis.deletePasswordReset({ email, otp });

        return res.status(StatusCode.OK).json({
          message: "Password Changed!"
        })

      } else {

        return next(errRes("Failed to update password!", StatusCode.INTERNAL_SERVER_ERROR));

      }

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async forgetPasswordVerification(req: Request, res: Response, next: NextFunction) {

    try {

      const { email, otp } = req.body;

      const verified = await authRedis.verifyOtp({ email, otp, type: "forget-password" });

      if (!verified) return next(errRes("Incorrect or expired OTP", StatusCode.UNAUTHORIZED));

      await authRedis.setPasswordReset({ email, otp });

      return res.status(StatusCode.OK).json({ success: true, message: "OTP verified" });

    } catch (err) {

      return next(errRouter(err));

    }

  }

}

const authCredentialControllers = new AuthCredentialControllers();

export default authCredentialControllers;