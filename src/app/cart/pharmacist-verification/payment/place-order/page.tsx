import React from 'react';
import OrderPlacedSuccess from '@/features/orders/OrderPlacedSuccess/OrderPlacedSuccess';

export const metadata = {
  title: 'Order Placed Successfully',
  robots: { index: false, follow: false },
};

export default function PlaceOrderSuccessPage() {
  return <OrderPlacedSuccess />;
}
