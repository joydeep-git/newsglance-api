import ErrorHandler from "@/error-handlers/error-handler";
import { StatusCode } from "@/types";
import { errorPrinter } from "@/error-handlers/error-responder";

const awsErrorHandler = (err: any): ErrorHandler => {

  const errorCode = err.name || "UnknownAWSError";

  errorPrinter("AWS Error", err);

  switch (errorCode) {
    case "NoSuchKey":
    case "NotFound":
      return new ErrorHandler({
        message: "The requested file or resource was not found.",
        status: StatusCode.NOT_FOUND
      });

    case "EntityTooLarge":
      return new ErrorHandler({
        message: "The file you are trying to upload is too large.",
        status: StatusCode.PAYLOAD_TOO_LARGE
      });

    case "InvalidObjectState":
      return new ErrorHandler({
        message: "The action cannot be performed on the file in its current state (e.g., archived).",
        status: StatusCode.BAD_REQUEST
      });
  }


  return new ErrorHandler({
    message: "Cloud service is currently unavailable!",
    status: StatusCode.INTERNAL_SERVER_ERROR
  });
};

export default awsErrorHandler;