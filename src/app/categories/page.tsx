import React from 'react';
import { AllCategories } from '@/features/categories/Category/AllCategories';

export const metadata = {
  title: 'All Medicine Categories',
  description: 'Browse our wide selection of generic medicine categories including Cardiac, Diabetic, Pain Relief, and Gastrointestinal products.',
  alternates: {
    canonical: 'https://medingen.in/categories',
  },
  openGraph: {
    title: 'All Medicine Categories | Medingen Pharmacy',
    description: 'Browse our wide selection of generic medicine categories including Cardiac, Diabetic, Pain Relief, and Gastrointestinal products.',
    type: 'website',
    url: 'https://medingen.in/categories',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Medicine Categories | Medingen Pharmacy',
    description: 'Browse our wide selection of generic medicine categories.',
  },
};

export default function AllCategoriesPage() {
  return <AllCategories />;
}
