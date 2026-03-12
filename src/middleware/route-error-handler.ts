
import { StatusCode } from "@/types";
import ErrorHandler from "@/errors/error-handler";


const routeErrorHandler = () => {

  throw new ErrorHandler({ message: "Wrong Route/Method! Please check the api call!", status: StatusCode.BAD_REQUEST });

}

export default routeErrorHandler;