import React from 'react';
import { PolicyPages } from '@/features/home/PolicyPages/PolicyPages';

export const metadata = {
  title: 'Return Policy',
  description: 'Learn about Medingen 7-day easy return policy for eligible products and medicines.',
  alternates: {
    canonical: 'https://medingen.in/policies-return-policy',
  },
};

export default function ReturnPolicyPage() {
  return <PolicyPages policy="return_policy" />;
}
