import React from 'react';
import { Offers } from '@/features/offers/Offers/Offers';

export const metadata = {
  title: 'Special Offers & Discounts on Generic Medicines',
  description: 'Explore exclusive discounts, promotional deals, and coupon savings on generic medicines at Medingen.',
  alternates: {
    canonical: 'https://medingen.in/offers',
  },
  openGraph: {
    title: 'Special Offers & Discounts on Generic Medicines | Medingen',
    description: 'Explore exclusive discounts, promotional deals, and coupon savings on generic medicines at Medingen.',
    url: 'https://medingen.in/offers',
  },
};

export default function OffersPage() {
  return <Offers />;
}
