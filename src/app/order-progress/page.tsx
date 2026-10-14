import React from 'react';
import OrderProgress from '@/features/orders/OrderProgressConfirmation/OrderProgressConfirmation';

export const metadata = {
  title: 'Order Progress',
  robots: { index: false, follow: false },
};

export default function OrderProgressPage() {
  return <OrderProgress />;
}
