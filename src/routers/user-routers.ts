import express , { Router } from "express";
import userControllers from "../controllers/user-controllers";
import authToken from "../middleware/auth-token";


class UserRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.patch("/update", authToken.validator,  userControllers.updateUser);

    this.router.patch("/update/avatar", authToken.validator, userControllers.updateAvatar);

  }

}

const userRouters = new UserRouters();

export default userRouters.router;