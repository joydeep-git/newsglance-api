import ErrorHandler from "./error-handler";
import { StatusCode } from "../types";

const redisErrorHandler = (err: unknown): ErrorHandler => {

  let status: number = StatusCode.INTERNAL_SERVER_ERROR;

  let message: string = "Redis Error";

  if (typeof err === "object" && err !== null) {

    const error = err as Error;

    if (error.message.includes("ECONNREFUSED")) {

      message = "Redis connection refused";

    } else if (error.message.includes("WRONGTYPE")) {

      message = "Redis type mismatch error";

    } else if (error.message.includes("NOAUTH")) {

      message = "Redis authentication error";

      status = StatusCode.UNAUTHORIZED;

    } else if (error.message.includes("READONLY")) {

      message = "Redis is in read-only mode";

    } else if (error.message.includes("Timeout")) {

      message = "Redis timeout error";

    } else if (error.message.includes("CONNECTION")) {

      message = "Redis connection error";

    } else if (error?.message) {

      message = error.message;

    }
  }

  return new ErrorHandler({ status, message });
};

export default redisErrorHandler;
