import paymentControllers from "../controllers/payment-controllers";
import authToken from "../middleware/auth-token";
import express, { Router } from "express";


class PaymentRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.get("/create", authToken.validator, paymentControllers.createProduct);
    
    this.router.get("/verify/:orderId", paymentControllers.verifyPayment);

    this.router.get("/history", authToken.validator, paymentControllers.getPaymentHistory);

  }

}

const paymentRouters = new PaymentRouters();

export default paymentRouters.router;