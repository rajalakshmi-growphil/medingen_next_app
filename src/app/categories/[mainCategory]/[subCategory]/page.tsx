import React from 'react';
import { CategoryPage } from '@/features/categories/Category/CategoryPage';

interface PageProps {
  params: Promise<{
    mainCategory: string;
    subCategory: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { mainCategory = '', subCategory = '' } = await params;
  const categoryName = subCategory.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const rawTitle = `${categoryName} Online at Low Prices`;
  const fullTitle = `${categoryName} Online at Low Prices | Medingen`;
  const description = `Buy ${categoryName} online from Medingen. Find high-quality generic equivalents for ${categoryName} and save up to 80% on your healthcare bills.`;
  const canonical = `https://medingen.in/categories/${mainCategory}/${subCategory}`;

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

export default function CategorySubPage() {
  return <CategoryPage />;
}

