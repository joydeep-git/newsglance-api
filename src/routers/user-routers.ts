import express , { Router } from "express";


class UserRouters {

  public readonly router: Router = express.Router();

}

const userRouters = new UserRouters();

export default userRouters.router;