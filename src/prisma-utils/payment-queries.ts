
import { UserDataType } from "../types/auth";
import db from "./db-client";
import { CreatePaymentRecordType, PaymentDataType } from "../types/payment";



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
          planExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from today
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