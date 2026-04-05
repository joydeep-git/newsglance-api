import ErrorHandler from "./error-handler";
import { StatusCode } from "../types";
import { errorPrinter } from "./error-responder";

const awsErrorHandler = (err: any): ErrorHandler => {

  const errorCode = err.name || "UnknownAWSError";

  errorPrinter("AWS Error", err);

  switch (errorCode) {

    // s3
    case "NoSuchKey":
    case "NotFound":
      return new ErrorHandler({
        message: "File not found!",
        status: StatusCode.NOT_FOUND,
      });

    case "EntityTooLarge":
      return new ErrorHandler({
        message: "The file is too large!",
        status: StatusCode.PAYLOAD_TOO_LARGE,
      });

    case "InvalidObjectState":
      return new ErrorHandler({
        message: "The action cannot be performed on the file in its current state.",
        status: StatusCode.BAD_REQUEST,
      });

    // polly
    case "TextLengthExceededException":
      return new ErrorHandler({
        message: "The text provided for audio generation is too long.",
        status: StatusCode.BAD_REQUEST,
      });

    case "InvalidSsmlException":
      return new ErrorHandler({
        message: "Invalid format provided for audio generation.",
        status: StatusCode.BAD_REQUEST,
      });

    case "LanguageNotSupportedException":
      return new ErrorHandler({
        message: "The selected language is not supported for audio generation.",
        status: StatusCode.BAD_REQUEST,
      });

    // bedrock
    case "ThrottlingException":
    case "TooManyRequestsException":
      return new ErrorHandler({
        message: "AI service rate limit reached. Please try again later.",
        status: StatusCode.TOO_MANY_REQUESTS,
      });

    case "ModelNotReadyException":
    case "ModelTimeoutException":
    case "ServiceUnavailableException":
      return new ErrorHandler({
        message: "AI service is temporarily unavailable.",
        status: StatusCode.SERVICE_UNAVAILABLE,
      });

    case "ValidationException":
      return new ErrorHandler({
        message: "Invalid request sent to AI service.",
        status: StatusCode.BAD_REQUEST,
      });

    case "ResourceNotFoundException":
      return new ErrorHandler({
        message: "Requested AI model not found.",
        status: StatusCode.NOT_FOUND,
      });

    // general
    case "AccessDeniedException":
    case "UnauthorizedException":
      return new ErrorHandler({
        message: "Cloud service access denied.",
        status: StatusCode.INTERNAL_SERVER_ERROR,
      });

    case "InvalidParameterException":
    case "InvalidParameterValueException":
      return new ErrorHandler({
        message: "Invalid parameters sent to cloud service.",
        status: StatusCode.BAD_REQUEST,
      });

    default:
      return new ErrorHandler({
        message: "Cloud service is currently unavailable!",
        status: StatusCode.INTERNAL_SERVER_ERROR,
      });
  }
};

export default awsErrorHandler;