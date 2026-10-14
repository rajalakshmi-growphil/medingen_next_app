import React from 'react';
import { SearchBox } from '@/features/search/SearchBox/SearchBox';

export const metadata = {
  title: 'Search Medicines Online',
  description: 'Search and buy generic medicines online on Medingen. Find affordable substitutes for any brand and save up to 80%.',
  alternates: {
    canonical: 'https://medingen.in/searchbox',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProductSearchPage() {
  return <SearchBox />;
}
