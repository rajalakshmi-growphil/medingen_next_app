import React from 'react';
import { OrderPayment } from '@/features/orders/OrderPayment/OrderPayment';

export const metadata = {
  title: 'Order Payment',
  robots: { index: false, follow: false },
};

export default function OrderPaymentPage() {
  return <OrderPayment />;
}
