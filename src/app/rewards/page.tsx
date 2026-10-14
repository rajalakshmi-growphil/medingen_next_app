import React from 'react';
import { Rewards } from '@/features/offers/Rewards/Rewards';

export const metadata = {
  title: 'Rewards & Cashbacks',
  robots: { index: false, follow: false },
};

export default function RewardsPage() {
  return <Rewards />;
}
