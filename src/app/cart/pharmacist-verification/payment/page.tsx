import React from 'react';
import PaymentPage from '@/features/cart/PaymentPage/PaymentPage';

export const metadata = {
  title: 'Checkout & Payment',
  robots: { index: false, follow: false },
};

export default function CartPaymentPage() {
  return <PaymentPage />;
}
