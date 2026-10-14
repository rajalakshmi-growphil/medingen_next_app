import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medingen.in';

export function createMetadata(options: {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, canonicalPath, ogType = 'website', ogImage, noIndex = false } = options;

  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const openGraphType = ogType === 'product' ? 'website' : ogType;

  return {
    title,
    description,
    robots: {
      index: !noIndex,
      follow: true,
    },
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
