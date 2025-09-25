import ErrorHandler from "./error-handler";
import { StatusCode } from "../types";
import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError, PrismaClientRustPanicError } from "@prisma/client/runtime/library";


const prismaErrorHandler = (err: unknown): ErrorHandler => {

  let status = StatusCode.INTERNAL_SERVER_ERROR;
  let message = "Database Error";

  if (err instanceof PrismaClientKnownRequestError) {

    switch (err.code) {

      case "P2002":
        status = StatusCode.CONFLICT;
        message = `Duplicate value for: ${err.meta?.target}`;
        break;

      case "P2000":
        status = StatusCode.BAD_REQUEST;
        message = "Value too long for the field";
        break;

      case "P2003":
        status = StatusCode.BAD_REQUEST;
        message = "Invalid foreign key reference";
        break;

      case "P2001":
        status = StatusCode.NOT_FOUND;
        message = "Record not found";
        break;

      case "P2005":
        status = StatusCode.BAD_REQUEST;
        message = "Value does not match column type";
        break;

      default:
        message = `Prisma error code: ${err.code}`;

    }
  } else if (err instanceof PrismaClientValidationError) {

    status = StatusCode.BAD_REQUEST;
    message = "Validation error. Invalid input.";

  } else if (err instanceof PrismaClientInitializationError) {

    message = "Database initialization error";

  } else if (err instanceof PrismaClientRustPanicError) {

    message = "Prisma internal error (panic)";

  }

  return new ErrorHandler({ status, message });
};

export default prismaErrorHandler;
