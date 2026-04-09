
import { UserDataType } from "../types/auth.js";
import db from "./db-client.js";
import { CreatePaymentRecordType, PaymentDataType } from "../types/payment.js";
import { planExpiryCalculator } from "@/utils/helpers.js";



const paymentQueries = {


  async createPaymentRecord({ amount = 119, orderId, currency, userId }: CreatePaymentRecordType) {

    return await db.payment.create({
      data: {
        amount,
        status: "PENDING",
        orderId,
        currency,
        userId,
      }
    });

  },



  async updatePaymentStatus({ orderId, status }: { orderId: string; status: "SUCCESS" | "FAILED" | "PENDING"; }): Promise<{ user: UserDataType | null; payment: PaymentDataType }> {

    return await db.$transaction(async (tx) => {

      const payment: PaymentDataType = await tx.payment.update({
        where: {
          orderId,
        },
        data: {
          status,
        }
      });

      if (status !== "SUCCESS") return { payment, user: null };

      const user = await tx.user.update({
        where: {
          id: payment.userId,
        },
        data: {
          isPremium: true,
          planExpiryDate: planExpiryCalculator(), // 1 month till midnight from today
        },
        include: {
          avatar: true,
        }
      }) as UserDataType;

      return { payment, user };

    })

  },



  async getPaymentHistory(userId: string) {

    return await db.payment.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  },





}

export default paymentQueries;