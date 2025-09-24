
import UserDataType from "./index";

declare global {

  namespace Express {

    interface Request {

      user: UserDataType;

    }

  }

}
