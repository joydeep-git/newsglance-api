import express , { Router } from "express";
import userControllers from "@/controllers/user-controllers";
import authToken from "@/middleware/auth-token";
import multerConfig from "@/middleware/multer-config";


class UserRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.patch("/update", authToken.validator,  userControllers.updateUser);

    this.router.patch("/avatar", authToken.validator, multerConfig.upload.single("avatar"), userControllers.updateAvatar);

    this.router.delete("/avatar", authToken.validator, userControllers.deleteAvatar);

  }

}

const userRouters = new UserRouters();

export default userRouters.router;