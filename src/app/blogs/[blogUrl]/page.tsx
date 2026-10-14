import React from 'react';
import { Blog } from '@/features/blogs/Blog/Blog';

export async function generateMetadata({ params }: { params: Promise<{ blogUrl: string }> }) {
  const resolvedParams = await params;
  const blogUrl = resolvedParams?.blogUrl || '';
  const formattedTitle = blogUrl.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const cleanTitle = formattedTitle || 'Health Blog';
  const fullTitle = `${cleanTitle} | Medingen Health Blog`;
  const description = `Read insightful articles about ${cleanTitle}, generic medicines, healthcare tips, and savings on Medingen.`;
  const canonical = `https://medingen.in/blogs/${blogUrl}`;

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ blogUrl: string }> }) {
  const resolvedParams = await params;
  const blogUrl = resolvedParams?.blogUrl || '';
  const formattedTitle = blogUrl.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const canonical = `https://medingen.in/blogs/${blogUrl}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: formattedTitle,
    description: `Read insightful articles about ${formattedTitle}, generic medicines, healthcare tips, and savings on Medingen.`,
    url: canonical,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Medingen',
      url: 'https://medingen.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://medingen.in/Medingen.jpg',
      },
    },
  };

  return (
    <>
      <script
        id="blog-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
      <Blog />
    </>
  );
}
