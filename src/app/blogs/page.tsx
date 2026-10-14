import React from 'react';
import { Blogs } from '@/features/blogs/Blogs/Blogs';

export const metadata = {
  title: 'Health & Generic Medicine Blog',
  description: 'Read the latest healthcare articles, generic vs branded medicine guides, wellness tips, and medical advice on Medingen.',
  alternates: {
    canonical: 'https://medingen.in/blogs',
  },
  openGraph: {
    title: 'Health & Generic Medicine Blog | Medingen',
    description: 'Read the latest healthcare articles and generic medicine guides on Medingen.',
    type: 'website',
    url: 'https://medingen.in/blogs',
  },
};

export default function BlogsPage() {
  return <Blogs />;
}
