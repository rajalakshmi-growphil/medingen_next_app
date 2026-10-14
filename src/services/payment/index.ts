import { apiClient } from '../api/client';

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentInitiateResponse {
  transactionId: string;
  redirectUrl?: string;
  status: string;
}

export async function initiatePayment(data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
  const res = await apiClient.post<PaymentInitiateResponse>('/payment/initiate', data);
  return res.data;
}
