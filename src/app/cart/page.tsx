import React from 'react';
import OrderProgress from '@/features/orders/OrderProgressConfirmation/OrderProgressConfirmation';

export const metadata = {
  title: 'Shopping Cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <OrderProgress />;
}
