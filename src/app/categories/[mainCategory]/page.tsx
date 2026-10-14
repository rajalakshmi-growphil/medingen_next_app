import React from 'react';
import { CategoryPage } from '@/features/categories/Category/CategoryPage';

export async function generateMetadata({ params }: { params: Promise<{ mainCategory: string }> }) {
  const resolvedParams = await params;
  const mainCat = resolvedParams?.mainCategory || '';
  const categoryName = mainCat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const rawTitle = `${categoryName} Online at Low Prices`;
  const fullTitle = `${categoryName} Online at Low Prices | Medingen`;
  const description = `Buy ${categoryName} online from Medingen. Find high-quality generic equivalents for ${categoryName} and save up to 80% on your healthcare bills.`;
  const canonical = `https://medingen.in/categories/${mainCat}`;

  return {
    title: rawTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}

export default function CategoryMainPage() {
  return <CategoryPage />;
}
