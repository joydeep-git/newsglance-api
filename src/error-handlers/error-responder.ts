import ErrorHandler from "./error-handler";
import prismaErrorHandler from "./prisma-error-handler";
import { StatusCode } from "../types";
import redisErrorHandler from "./redis-error-handler";

export const errRes = (message: string, status: number): ErrorHandler => {
  return new ErrorHandler({ message, status });
};

export const errRouter = (err: unknown, fallbackMessage = "Internal Server error") => {

  if ((err as any)?.clientVersion) {

    return prismaErrorHandler(err);

  } else if (err instanceof Error && err.message.includes("Redis")) {

    return redisErrorHandler(err);

  } else if (err instanceof Error) {

    return errRes(err.message, StatusCode.INTERNAL_SERVER_ERROR);

  } else {

    return errRes(fallbackMessage, StatusCode.INTERNAL_SERVER_ERROR);

  }

};
