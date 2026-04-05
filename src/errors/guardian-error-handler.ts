import { AxiosError } from "axios";
import ErrorHandler from "./error-handler.js";
import { StatusCode } from "../types/index.js";


const guardianErrorHandler = (err: AxiosError, context?: string): ErrorHandler => {
  const status = err.response?.status;

  if (status === 429) return new ErrorHandler({ message: "Guardian API rate limit reached — try again later", status: 429 });
  if (status === 401) return new ErrorHandler({ message: "Invalid Guardian API key", status: 401 });
  if (status === 404) return new ErrorHandler({ message: `Guardian section not found${context ? `: ${context}` : ""}`, status: 404 });
  if (status === 400) return new ErrorHandler({ message: `Bad Guardian API request${context ? `: ${context}` : ""}`, status: 400 });

  return new ErrorHandler({ message: `Guardian API error: ${status ?? "Network failure"}`, status: StatusCode.INTERNAL_SERVER_ERROR });
};

export default guardianErrorHandler;