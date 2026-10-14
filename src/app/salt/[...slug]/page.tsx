import React from 'react';
import { SaltPage } from '@/features/products/SaltPage/SaltPage';

export async function generateMetadata({ params }: { params: Promise<{ slug?: string | string[] }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ? (Array.isArray(resolvedParams.slug) ? resolvedParams.slug.join('/') : resolvedParams.slug) : '';
  const formattedName = rawSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const rawTitle = `${formattedName} – Uses, Dosage, Side Effects & Price`;
  const fullTitle = `${formattedName} – Uses, Dosage, Side Effects & Price | Medingen`;
  const description = `Complete information on ${formattedName}: uses, dosage, side effects, interactions, substitutes and best price. Compare generic medicines with ${formattedName} composition.`;
  const canonical = `https://medingen.in/salt/${rawSlug}`;

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

export default async function SaltDetailPage({ params }: { params: Promise<{ slug?: string | string[] }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug ? (Array.isArray(resolvedParams.slug) ? resolvedParams.slug.join('/') : resolvedParams.slug) : '';
  const formattedName = rawSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const canonical = `https://medingen.in/salt/${rawSlug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://medingen.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: formattedName,
        item: canonical,
      },
    ],
  };

  const drugSchema = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: formattedName,
    description: `Complete information on ${formattedName}: uses, dosage, side effects, interactions, substitutes and best price. Compare generic medicines with ${formattedName} composition.`,
    url: canonical,
    activeIngredient: formattedName,
  };

  return (
    <>
      <script
        id="salt-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        id="salt-drug-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(drugSchema).replace(/</g, '\\u003c'),
        }}
      />
      <SaltPage />
    </>
  );
}
