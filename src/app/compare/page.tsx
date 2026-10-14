import React from 'react';
import { CompareView } from '@/features/products/CompareView/CompareView';

export const metadata = {
  title: 'Compare Medicines',
  description: 'Compare generic medicines and branded options side by side on Medingen.',
};

export default function ComparePage() {
  return <CompareView />;
}
