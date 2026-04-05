import { UserDataType } from "./auth";


declare global {

  namespace Express {

    interface Request {

      user: UserDataType;

      token: string;

    }

  }

}
