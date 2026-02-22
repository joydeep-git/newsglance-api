import ErrorHandler from "@/error-handlers/error-handler";
import { StatusCode } from "@/types";
import { Prisma } from "@prisma/client";
import { errorPrinter } from "@/error-handlers/error-responder";



const prismaErrorHandler = (err: unknown): ErrorHandler => {


  errorPrinter("Prisma Error", err);


  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    switch (err.code) {

      case "P2002":

        const target = (err.meta?.target as string[])?.join(", ") || "field";

        return new ErrorHandler({
          message: `This ${target} is already taken. Please choose another.`,
          status: StatusCode.CONFLICT
        });


      case "P2003":
        return new ErrorHandler({
          message: "Invalid reference. The related record does not exist.",
          status: StatusCode.BAD_REQUEST
        });

      case "P2025":
        return new ErrorHandler({
          message: "The record you are trying to update or delete does not exist.",
          status: StatusCode.NOT_FOUND
        });

      case "P2000":
        return new ErrorHandler({
          message: "Input value is too long for the database field.",
          status: StatusCode.BAD_REQUEST
        });
    }
  }


  if (err instanceof Prisma.PrismaClientValidationError) {
    return new ErrorHandler({
      message: "Invalid data format provided.",
      status: StatusCode.BAD_REQUEST
    });
  }


  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new ErrorHandler({
      message: "Database connection failed. Please try again later.",
      status: StatusCode.SERVICE_UNAVAILABLE
    });
  }


  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return new ErrorHandler({
      message: "Critical database error. Our team has been notified.",
      status: StatusCode.INTERNAL_SERVER_ERROR
    });
  }


  return new ErrorHandler({
    message: "An unexpected database error occurred.",
    status: StatusCode.INTERNAL_SERVER_ERROR
  });
};

export default prismaErrorHandler;