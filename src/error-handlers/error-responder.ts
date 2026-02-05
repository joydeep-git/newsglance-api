import ErrorHandler from "@/error-handlers/error-handler";
import prismaErrorHandler from "@/error-handlers/prisma-error-handler";
import { StatusCode } from "@/types";
import redisErrorHandler from "@/error-handlers/redis-error-handler";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import awsErrorHandler from "@/error-handlers/aws-error-handler";

export const errRes = (message: string, status: number): ErrorHandler => {
  return new ErrorHandler({ message, status });
};



export const errRouter = (err: unknown, fallbackMessage = "Internal Server Error"): ErrorHandler => {


  if (err instanceof ErrorHandler) {
    return err;
  }


  if (isPrismaError(err)) {
    return prismaErrorHandler(err);
  }


  if (isAWSError(err)) {
    return awsErrorHandler(err);
  }


  if (isRedisError(err)) {
    return redisErrorHandler(err);
  }


  if (err instanceof Error) {

    if (process.env.NODE_ENV === 'development') {
      return new ErrorHandler({
        message: err.message,
        status: StatusCode.INTERNAL_SERVER_ERROR
      });
    }

    errorPrinter("General Errors", err);
    
    return new ErrorHandler({
      message: fallbackMessage,
      status: StatusCode.INTERNAL_SERVER_ERROR
    });
  }


  return new ErrorHandler({
    message: fallbackMessage,
    status: StatusCode.INTERNAL_SERVER_ERROR
  });
};




export const isPrismaError = (err: any): err is PrismaClientKnownRequestError | PrismaClientValidationError | PrismaClientInitializationError | PrismaClientRustPanicError => {
  return (
    err instanceof PrismaClientKnownRequestError ||
    err instanceof PrismaClientValidationError ||
    err instanceof PrismaClientInitializationError ||
    err instanceof PrismaClientRustPanicError
  );
};




export const isAWSError = (err: any): boolean => {
  return !!(err && typeof err === 'object' && '$metadata' in err);
};



export const isRedisError = (err: any): boolean => {
  if (err?.name === "RedisError" || err?.name === "ReplyError") return true;
  if (err instanceof Error && err.message.toLowerCase().includes("redis")) return true;
  return false;
};


export const errorPrinter = (type: string, err: unknown) => {

  const isDev: boolean = (process.env.NODE_ENV === "development") || false;

  if (isDev) {
    console.log(`[${type}]`, err);
  }

}