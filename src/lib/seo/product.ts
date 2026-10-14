import type { Metadata } from 'next';
import type { Product } from '@/types/product';
import { createMetadata } from './metadata';

export function generateProductMetadata(product: Product | null, slug: string): Metadata {
  if (!product) {
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return createMetadata({
      title: `${name} - Buy Online at Best Price | Medingen`,
      description: `Buy ${name} online at Medingen. Get affordable generic substitutes with same salt composition and quality.`,
      canonicalPath: `/product/${slug}`,
      ogType: 'product',
    });
  }

  const title = product.meta_title || product.metaTitle || product.productName || product.name || 'Medingen Product';
  const description = product.meta_description || product.metaDescription || product.used_for || product.productDescription || 'Trusted online pharmacy product details.';
  const image = product.first_image_url ? `https://d1dh0rr5xj2p49.cloudfront.net/products/${product.first_image_url}` : undefined;

  return createMetadata({
    title,
    description,
    canonicalPath: `/product/${product.product_name_url || slug}`,
    ogType: 'product',
    ogImage: image,
  });
}
