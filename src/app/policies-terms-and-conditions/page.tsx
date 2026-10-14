import React from 'react';
import { PolicyPages } from '@/features/home/PolicyPages/PolicyPages';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing the use of Medingen online pharmacy services, ordering, and delivery.',
  alternates: {
    canonical: 'https://medingen.in/policies-terms-and-conditions',
  },
};

export default function TermsPage() {
  return <PolicyPages policy="terms_and_conditions" />;
}
