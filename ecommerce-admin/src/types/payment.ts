// src/types/Payment.ts
export interface Payment {
  id?: number;
  transactionId: string;
  orderId: number;
  paymentStatus: 'succeeded' | 'failed' | 'pending';
  paymentMode: string;
  amount: number;
  currency: string;
}
