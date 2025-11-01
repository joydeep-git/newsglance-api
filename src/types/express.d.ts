import { UserDataType } from "./auth-types";


declare global {

  namespace Express {

    interface Request {

      user: UserDataType;

      token: string;

    }

  }

}
