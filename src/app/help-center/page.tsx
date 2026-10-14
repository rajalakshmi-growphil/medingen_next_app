import React from 'react';
import { HelpCenter } from '@/features/cart/LandingPage/LandingPage';

export const metadata = {
  title: 'Help Center & Customer Support',
  description: 'Get help and support for ordering generic medicines, uploading prescriptions, and order tracking on Medingen.',
  alternates: {
    canonical: 'https://medingen.in/help-center',
  },
  openGraph: {
    title: 'Help Center & Support | Medingen',
    description: 'Get help and support for ordering generic medicines, uploading prescriptions, and order tracking on Medingen.',
    url: 'https://medingen.in/help-center',
  },
};

export default function HelpCenterPage() {
  return <HelpCenter />;
}
