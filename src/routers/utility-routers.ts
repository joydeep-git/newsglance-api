import express, { Router } from "express";
import utilityControllers from "../controllers/utility-controllers.js";


class UtilityRouters {

  public router: Router = express.Router();



  constructor() {

    this.router.get("/health", utilityControllers.test);

    this.router.post("/generate-otp", utilityControllers.generateOtp);

    this.router.get("/reset-limit", utilityControllers.resetLimit);

    this.router.get("/database", utilityControllers.checkDb);

    this.router.get("/fuel-price", utilityControllers.getFuelPrice);

  }

}

const utilityRouters = new UtilityRouters();

export default utilityRouters.router;