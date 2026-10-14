import React from 'react';
import { OffersView } from '@/features/offers/OffersView/OffersView';

export const metadata = {
  title: 'Offer Details',
  description: 'View offer details and discounts on Medingen.',
};

export default function ViewOfferPage() {
  return <OffersView />;
}
