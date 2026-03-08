import ErrorHandler from "@/error-handlers/error-handler";
import { CashfreeError, StatusCode } from "@/types";
import { errorPrinter } from "./error-responder";


const cashfreeErrorHandler = (err: CashfreeError): ErrorHandler => {

  errorPrinter("Cashfree Error", err);

  switch (err.code) {
    case "PAYMENT_DECLINED":
      return new ErrorHandler({ message: "Payment was declined. Please try a different payment method.", status: StatusCode.BAD_REQUEST });
    case "INVALID_PAYMENT_SESSION":
      return new ErrorHandler({ message: "Payment session is invalid or expired. Please try again.", status: StatusCode.BAD_REQUEST });
    case "ORDER_ALREADY_PAID":
      return new ErrorHandler({ message: "This order has already been paid.", status: StatusCode.CONFLICT });
    case "TRANSACTION_FAILED":
      return new ErrorHandler({ message: "Transaction failed. Please retry.", status: StatusCode.BAD_REQUEST });
    case "AUTHENTICATION_ERROR":
      return new ErrorHandler({ message: "Payment authentication failed.", status: StatusCode.UNAUTHORIZED });
    default:
      return new ErrorHandler({ message: err.message || "Payment processing failed.", status: StatusCode.INTERNAL_SERVER_ERROR });
  }
};

export default cashfreeErrorHandler;