
import ErrorHandler from "@/errors/error-handler";
import { GeminiErrorType, StatusCode } from "@/types";
import { errorPrinter } from "@/errors/error-responder";


const geminiErrCode = (status: string): number | undefined => {

  const map: Record<string, number> = {
    UNAVAILABLE: 503,
    RESOURCE_EXHAUSTED: 429,
    UNAUTHENTICATED: 401,
    PERMISSION_DENIED: 403,
    NOT_FOUND: 404,
    INVALID_ARGUMENT: 400,
    INTERNAL: 500,
  };

  return map[status?.toUpperCase()];
};


const geminiErrorHandler = (err: GeminiErrorType): ErrorHandler => {

  errorPrinter("Gemini Error", err);

  let status: number | string | undefined = err.status ?? err.code;

  let reason = err.errorDetails?.[0]?.reason;

  if (!status && err.message) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed?.error) {
        status = parsed.error.code ?? geminiErrCode(parsed.error.status);
        if (!status && parsed.error.status) {
          status = geminiErrCode(parsed.error.status);
        }
      }
    } catch { }
  }

  const httpStatus = Number(status);


  // Model not found
  if (httpStatus === 404 || reason === "MODEL_NOT_FOUND") {
    return new ErrorHandler({
      message: "AI model not available. Please try again later.",
      status: StatusCode.SERVICE_UNAVAILABLE,
    });
  }

  // quota end
  if (httpStatus === 429 || reason === "RATE_LIMIT_EXCEEDED") {
    return new ErrorHandler({
      message: "AI service is busy. Please try again in a moment.",
      status: StatusCode.TOO_MANY_REQUESTS,
    });
  }

  // wrong key
  if (httpStatus === 401 || httpStatus === 403 || reason === "API_KEY_INVALID") {
    return new ErrorHandler({
      message: "AI service authentication failed.",
      status: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }

  // safety filters
  if (httpStatus === 400 || reason === "SAFETY") {
    return new ErrorHandler({
      message: "Content was blocked by AI safety filters.",
      status: StatusCode.BAD_REQUEST,
    });
  }

  // temporarily unavailable
  if (httpStatus === 500 || httpStatus === 503) {
    return new ErrorHandler({
      message: "AI service is temporarily unavailable. Please try again later.",
      status: StatusCode.SERVICE_UNAVAILABLE,
    });
  }

  return new ErrorHandler({
    message: "Failed to process AI request.",
    status: StatusCode.SERVICE_UNAVAILABLE,
  });
};

export default geminiErrorHandler;