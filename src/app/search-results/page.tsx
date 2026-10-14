import React from 'react';
import { SearchResults } from '@/features/search/SearchResults/SearchResults';

export const metadata = {
  title: 'Search Results',
  description: 'Search results for generic medicines and affordable substitutes on Medingen.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchResultsPage() {
  return <SearchResults />;
}
