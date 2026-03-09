import ErrorHandler from "@/error-handlers/error-handler";
import prismaErrorHandler from "@/error-handlers/prisma-error-handler";
import { StatusCode } from "@/types";
import redisErrorHandler from "@/error-handlers/redis-error-handler";
import awsErrorHandler from "@/error-handlers/aws-error-handler";
import cashfreeErrorHandler from "@/error-handlers/cashfree-error-handler";
import { Prisma } from "@/generated/prisma/client";

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


  if (isCashfreeError(err)) {
    return cashfreeErrorHandler(err as any);
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




export const isPrismaError = (err: unknown): boolean => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  );
};




export const isAWSError = (err: unknown): boolean => {
  return !!(err && typeof err === 'object' && '$metadata' in err);
};



export const isRedisError = (err: any): boolean => {
  if (err?.name === "RedisError" || err?.name === "ReplyError") return true;
  if (err instanceof Error && err.message.toLowerCase().includes("redis")) return true;
  return false;
};


export const isCashfreeError = (err: unknown): boolean => {
  return !!(
    err &&
    typeof err === "object" &&
    ("code" in err || "type" in err) &&
    "message" in err &&
    // Cashfree errors typically have a `type` like "PAYMENT_ERROR" or a cf_ prefixed code
    (String((err as any).type).includes("PAYMENT") ||
      String((err as any).code).startsWith("cf_") ||
      String((err as any).code) === (err as any).code?.toUpperCase())
  );
};


export const errorPrinter = (type: string, err: unknown) => {

  const isDev: boolean = (process.env.NODE_ENV === "development") || false;

  if (isDev) {
    console.log(`[${type}]`, JSON.stringify(err));
  }

}