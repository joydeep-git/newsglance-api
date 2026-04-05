import { AxiosError } from "axios";
import { StatusCode } from "../types/index.js";
import { Prisma } from "../generated/prisma/client.js";
import ErrorHandler from "./error-handler.js";
import prismaErrorHandler from "./prisma-error-handler.js";
import redisErrorHandler from "./redis-error-handler.js";
import awsErrorHandler from "./aws-error-handler.js";
import cashfreeErrorHandler from "./cashfree-error-handler.js";
import guardianErrorHandler from "./guardian-error-handler.js";
import geminiErrorHandler from "./gemini-error-handler.js";
import { S3ServiceException } from "@aws-sdk/client-s3";
import { PollyServiceException } from "@aws-sdk/client-polly";
import { BedrockRuntimeServiceException } from "@aws-sdk/client-bedrock-runtime";



export const errRes = (message: string, status: number): ErrorHandler => {
  return new ErrorHandler({ message, status });
};



export const errRouter = (err: unknown, fallbackMessage = "Internal Server Error"): ErrorHandler => {


  if (err instanceof ErrorHandler) return err;

  if (isPrismaError(err)) return prismaErrorHandler(err);

  if (isAWSError(err)) return awsErrorHandler(err);

  if (isRedisError(err)) return redisErrorHandler(err);

  if (isCashfreeError(err)) return cashfreeErrorHandler(err as any);

  if (isGeminiError(err)) return geminiErrorHandler(err as any);

  if (isGuardianError(err)) return guardianErrorHandler(err as AxiosError);


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




const isPrismaError = (err: unknown): boolean => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  );
};




const isAWSError = (err: unknown): boolean => {
  return (
    err instanceof S3ServiceException ||
    err instanceof PollyServiceException ||
    err instanceof BedrockRuntimeServiceException
  );
};



const isRedisError = (err: any): boolean => {

  if (err?.name === "RedisError" || err?.name === "ReplyError") return true;

  if (err instanceof Error && err.message.toLowerCase().includes("redis")) return true;

  return false;
};


const isCashfreeError = (err: unknown): boolean => {

  if (!(err && typeof err === "object" && "message" in err)) return false;

  // must have PAYMENT
  if ("type" in err && String((err as any).type).includes("PAYMENT")) return true;

  // must have cf_
  if ("code" in err && String((err as any).code).startsWith("cf_")) return true;

  return false;
};


const isGuardianError = (err: unknown): boolean => {
  return err instanceof AxiosError && !!err.response?.status;
};



const isGeminiError = (err: unknown): boolean => {

  if (!(err && typeof err === "object")) return false;

  const constructorName = String((err as any)?.constructor?.name).toLowerCase();
  
  if (constructorName.includes("google") || constructorName.includes("gemini")) return true;

  if ("errorDetails" in err && Array.isArray((err as any).errorDetails)) return true;

  return false;
};



export const errorPrinter = (type: string, err: unknown) => {

  const isDev: boolean = (process.env.NODE_ENV === "development") || false;

  if (isDev) {
    console.log(`[${type}]`, JSON.stringify(err));
  } else {
    console.log(type);
  }

}

