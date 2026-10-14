import React from 'react';
import { CategoryPage } from '@/features/categories/Category/CategoryPage';

export const metadata = {
  title: 'Medicines Online at Low Prices',
  description: 'Browse generic medicines online from Medingen.',
  alternates: {
    canonical: 'https://medingen.in/categories',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegacyCategoryPage() {
  return <CategoryPage />;
}
