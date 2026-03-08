import { errorPrinter, errRes, errRouter } from "@/error-handlers/error-responder";
import paymentQueries from "@/prisma-utils/payment-queries";
import paymentService from "@/services/payment-service/payment-service";
import authRedis from "@/services/redis-service/auth-redis";
import { StatusCode } from "@/types";
import { NextFunction, Request, Response } from "express";


class PaymentControllers {

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if(!req.user.isPremium) {
        return next(errRes("You already have premium membership!", StatusCode.FORBIDDEN));
      }

      const product = await paymentService.createOrder({ user: req.user });

      if (!product) return next(errRes("Error creating product!", StatusCode.SERVICE_UNAVAILABLE));


      const paymentRecord = await paymentQueries.createPaymentRecord({
        amount: Number(product.order_amount),
        orderId: product.order_id as string,
        currency: product.order_currency as string,
        userId: req.user.id,
      });

      if (!paymentRecord) return next(errRes("Error creating payment record!", StatusCode.SERVICE_UNAVAILABLE));

      return res.status(201).json({ message: "Product created!", data: product });

    } catch (err) {

      errorPrinter("Create Product Error:", err);

      return next(errRouter(err));
    }

  }


  public verifyPayment = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const { orderId } = req.params;

      if (!orderId) return next(errRes("Order ID is required!", StatusCode.BAD_REQUEST));

      const status = await paymentService.verifyPayment(orderId as string);

      // update payment record
      const { payment, user } = await paymentQueries.updatePaymentStatus({ orderId, status: status });

      if (user) await authRedis.setUserData(user);

      return res.status(200).json({ message: "Payment verified!", data: { paymentStatus: payment.status, user } });

    } catch (err) {
      errorPrinter("Verify Payment Error:", err);
      return next(errRouter(err));
    }

  }


  public getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const paymentHistory = await paymentQueries.getPaymentHistory(req.user.id);

      return res.status(200).json({ message: "Payment history retrieved!", data: paymentHistory });

    } catch (err) {

      errorPrinter("Get Payment History Error:", err);

      return next(errRouter(err));

    }

  }


}

const paymentControllers = new PaymentControllers();

export default paymentControllers;