



export type PaymentStatusType = "SUCCESS" | "PENDING" | "FAILED";


export type CreatePaymentRecordType = {
  amount: number;
  orderId: string;
  currency: string;
  userId: string;
}


export type CashfreeErrorType = {
  code?: string;
  message?: string;
  type?: string;
  details?: string;
}


export type PaymentDataType = {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatusType;
  createdAt: Date;
  updatedAt: Date;
}
