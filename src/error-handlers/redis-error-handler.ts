// src/error-handlers/redis-error-handler.ts
import ErrorHandler from "@/error-handlers/error-handler";
import { StatusCode } from "@/types";
import { errorPrinter } from "@/error-handlers/error-responder";

const redisErrorHandler = (err: any): ErrorHandler => {


  errorPrinter("REDIS ERROR", err);


  const message = err.message || "";


  if (message.includes("MOVED") || message.includes("CLUSTERDOWN")) {
    return new ErrorHandler({
      message: "Cache service is currently rebalancing. Please try again.",
      status: StatusCode.SERVICE_UNAVAILABLE
    });
  }

  if (message.includes("NOAUTH")) {
    return new ErrorHandler({
      message: "Cache authentication failed internally.",
      status: StatusCode.INTERNAL_SERVER_ERROR
    });
  }


  return new ErrorHandler({
    message: "Cache service unavailable.",
    status: StatusCode.INTERNAL_SERVER_ERROR
  });
};

export default redisErrorHandler;