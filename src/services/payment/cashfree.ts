
import { errorPrinter, errRes } from "../../errors/error-responder";
import { StatusCode } from "../../types";
import { PaymentStatusType } from "../../types/payment";
import { UserDataType } from "../../types/auth";
import { Cashfree, CFEnvironment, OrderEntity } from "cashfree-pg";


class CashfreePay {

  private cashfree: Cashfree;

  private fontendUrl: string = process.env.FRONTEND_URL || "http://localhost:3000";

  constructor() {

    try {

      this.cashfree = new Cashfree(
        CFEnvironment.SANDBOX,
        process.env.CASHFREE_APP_ID,
        process.env.CASHFREE_SECRET_KEY
      );

    } catch (err) {
      errorPrinter("Payment Init Failed:", err);
      throw err;
    }

  }



  public createOrder = async ({ user }: { user: UserDataType; }): Promise<OrderEntity> => {

    try {

      const res = await this.cashfree.PGCreateOrder({
        order_amount: 119,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id,
          customer_email: user.email,
          // customer_phone: userCountry?.countrycode === "+91" ? user.phoneNumber : "+919876543210",
          customer_phone: "+919876543210",
          customer_name: user.name,
        },
        order_note: "Subscription for NewsGlance",
        order_meta: {
          return_url: `${this.fontendUrl}/payment-status?id={order_id}`,
          payment_methods: "cc,dc,upi",
        },
        order_tags: {
          name: "Developer",
          company: "Cashfree"
        }
      });

      return res.data;

    } catch (err) {
      errorPrinter("Create Order Failed:", err);
      throw err;
    }

  }




  public verifyPayment = async (orderid: string): Promise<PaymentStatusType> => {

    try {

      let paymentStatus: PaymentStatusType = "FAILED";

      const res = await this.cashfree.PGOrderFetchPayments(orderid);

      const paymentData = res.data;

      // of no data
      if (!paymentData || paymentData.length === 0) {
        throw errRes("No payment data found for this order!", StatusCode.NOT_FOUND);
      }


      // check the last transaction
      switch (paymentData[0].payment_status) {

        case "SUCCESS":
          paymentStatus = "SUCCESS";
          break;

        case "PENDING":
          paymentStatus = "PENDING";
          break;

        default:
          paymentStatus = "FAILED";
          break;
      }

      return paymentStatus;

    } catch (err) {
      errorPrinter("Payment Verification Failed:", err);
      throw err;
    }

  }


  


}

const cashfree = new CashfreePay();

export default cashfree;

