import express, { Router } from "express";
import utilityControllers from "@/controllers/utility-controllers";


class UtilityRouters {

  public router: Router = express.Router();



  constructor() {

    this.router.get("/test", utilityControllers.test);

    this.router.post("/generate-otp", utilityControllers.generateOtp);

    this.router.get("/reset-limit", utilityControllers.resetLimit);

    this.router.get("/upload-default-image", utilityControllers.uploadDefaultImage);

  }

}

const utilityRouters = new UtilityRouters();

export default utilityRouters.router;