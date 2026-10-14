import React from 'react';
import { PolicyPages } from '@/features/home/PolicyPages/PolicyPages';

export const metadata = {
  title: 'Grievance Redressal Policy',
  description: 'Medingen Grievance Redressal Mechanism for customer complaints, inquiries, and resolution process.',
  alternates: {
    canonical: 'https://medingen.in/policies-grievance-redressal-policy',
  },
};

export default function GrievancePage() {
  return <PolicyPages policy="grievance_redressal_policy" />;
}
