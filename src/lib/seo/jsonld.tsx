import React from 'react';
import type { Product } from '@/types/product';
import type { SaltComposition } from '@/types/salt';

export function ProductJsonLd({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName || product.name || 'Medingen Product',
    image: product.first_image_url ? `https://d1dh0rr5xj2p49.cloudfront.net/products/${product.first_image_url}` : undefined,
    description: product.productDescription || product.meta_description || product.used_for || 'Trusted online pharmacy product details.',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.ourPrice || product.product_pricing_new || product.selling_price || 0.0,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function DrugJsonLd({ salt, slug }: { salt: SaltComposition | null; slug: string }) {
  const name = salt?.composition || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name,
    description: salt?.description || `Complete information on ${name}: uses, dosage, side effects, interactions, and substitutes.`,
    url: `https://medingen.in/salt/${slug}`,
    activeIngredient: name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
