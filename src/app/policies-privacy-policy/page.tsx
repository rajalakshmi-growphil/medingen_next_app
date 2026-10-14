import React from 'react';
import { PolicyPages } from '@/features/home/PolicyPages/PolicyPages';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Read Medingen Privacy Policy regarding data protection, customer privacy, and prescription confidentiality.',
  alternates: {
    canonical: 'https://medingen.in/policies-privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <PolicyPages policy="privacy_policy" />;
}
