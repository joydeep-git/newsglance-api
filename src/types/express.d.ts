import { UserDataType } from "@/types/auth";


declare global {

  namespace Express {

    interface Request {

      user: UserDataType;

      token: string;

    }

  }

}
