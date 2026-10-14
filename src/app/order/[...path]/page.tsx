import React from 'react';
import OrderTrack from '@/features/orders/OrdersTrack/OrdersTrack';

export const metadata = {
  title: 'Track Order',
  robots: { index: false, follow: false },
};

export default function OrderTrackPage() {
  return <OrderTrack />;
}
