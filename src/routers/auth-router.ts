
import express, { Router } from "express";
import authControllers from "../controllers/auth-controllers/auth-credential-controller";
import authGoogleController from "../controllers/auth-controllers/auth-google-controller";
import authGeneralControllers from "../controllers/auth-controllers/auth-general-controller";
import authToken from "../middleware/auth-token";


class AuthRouters {

  public readonly router: Router = express.Router();

  constructor() {

    this.credentialAuthRouters();

    this.googleAuthRoutes();

    this.generaleAuthRoutes();

  }


  // email and password login handlers
  private credentialAuthRouters(): void {

    this.router.post("/cr/register", authControllers.register);

    this.router.post("/cr/login", authControllers.login);

    this.router.post("/cr/forget-password", authControllers.forgetPassword);

  }



  // only google auth handlers
  private googleAuthRoutes(): void {

    this.router.post("/google/authorize", authGoogleController.authorize);

  }


  // general auth router
  private generaleAuthRoutes(): void {

    this.router.get("/logout", authGeneralControllers.logout);

    this.router.delete("/delete", authGeneralControllers.deleteAccount);

    this.router.get("/verify-token", authToken.validator, authGeneralControllers.verifyToken);

  }

}

const authRouters = new AuthRouters();

export default authRouters.router;