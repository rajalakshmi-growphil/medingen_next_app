/**
 * Utility functions for formatting product URLs consistently
 * across Localhost and Production.
 */

export function extractProductSlug(val: string): string {
  if (!val) return '';
  let str = String(val).trim();
  if (str.startsWith('http://') || str.startsWith('https://')) {
    try {
      const u = new URL(str);
      str = u.pathname;
    } catch (_) {
      str = str.replace(/^https?:\/\/[^\/]+/, '');
    }
  }
  return str.replace(/^\/product\//, '').replace(/^\//, '');
}

export function getBaseUrl(headerHost?: string | null): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    if (origin && !origin.includes('undefined')) {
      return origin;
    }
  }

  if (headerHost) {
    if (headerHost.includes('localhost') || headerHost.includes('127.0.0.1')) {
      return `http://${headerHost}`;
    }
    if (headerHost.includes('medingen.in')) {
      return 'https://medingen.in';
    }
    const proto = headerHost.includes('localhost') ? 'http' : 'https';
    return `${proto}://${headerHost}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://medingen.in';
  }
  return 'http://localhost:3000';
}

export function formatProductUrl(slugOrUrl: string, baseUrl?: string): string {
  const slug = extractProductSlug(slugOrUrl);
  if (!slug) return '';
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, '')}/product/${slug}`;
  }
  return `/product/${slug}`;
}

/**
 * Encodes and normalizes CloudFront product image URLs, safely handling
 * filenames with spaces and special characters.
 */
export function formatProductImageUrl(raw?: string): string {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return encodeURI(decodeURI(trimmed));
    } catch {
      return encodeURI(trimmed);
    }
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  try {
    const decoded = decodeURIComponent(cleanPath);
    return `https://d1dh0rr5xj2p49.cloudfront.net/products/${encodeURIComponent(decoded)}`;
  } catch {
    return `https://d1dh0rr5xj2p49.cloudfront.net/products/${encodeURIComponent(cleanPath)}`;
  }
}

/**
 * Generates SEO-friendly URL slugs for categories
 */
export function slugifyCategory(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

