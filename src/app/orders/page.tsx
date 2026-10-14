import React from 'react';
import { Orders } from '@/features/orders/Orders/Orders';

export const metadata = {
  title: 'My Orders',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <Orders />;
}
