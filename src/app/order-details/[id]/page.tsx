import React from 'react';
import OrderDetails from '@/features/orders/OrderDetails/OrderDetails';

export const metadata = {
  title: 'Order Details',
  robots: { index: false, follow: false },
};

export default function OrderDetailsPage() {
  return <OrderDetails />;
}
