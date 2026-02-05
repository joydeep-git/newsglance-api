import { NextFunction, Request, Response } from "express";
import { errRes } from "@/error-handlers/error-responder";
import { StatusCode } from "@/types";


const otpValidator = (req: Request, res: Response, next: NextFunction) => {

  const { otp } = req.body;

  if (!otp) {
    next(errRes("Please enter the  OTP!", StatusCode.BAD_REQUEST))
  }



}

export default otpValidator;