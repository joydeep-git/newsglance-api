
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/types";
import ErrorHandler from "@/error-handlers/error-handler";


const errorMiddleware = (
  err: ErrorHandler | Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const statusCode = err instanceof ErrorHandler ? err.statusCode : StatusCode.INTERNAL_SERVER_ERROR;

  const message = err instanceof ErrorHandler ? err.message : "Internal Server Error";


  const responseBody = {
    error: true,
    success: false,
    statusCode,
    message,
    stack: err.stack || "No stack trace available"
  };

  if (process.env.NODE_ENV === "production") delete responseBody.stack;


  res.status(statusCode).json(responseBody);

};

export default errorMiddleware;