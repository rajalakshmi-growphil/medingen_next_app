import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import SearchViewMedicine from '@/features/products/SearchViewMedicine/SearchViewMedicine';
import { extractProductSlug, formatProductUrl, formatProductImageUrl, slugifyCategory } from '@/utils/url';

const API_ENDPOINT = 'https://medingen.in/api/';

interface CategoryItem {
  id: number;
  name: string;
  sub_categories?: Array<{ name: string; image?: string }>;
}

const getCachedProduct = cache(async (slug: string) => {
  if (!slug) return null;
  try {
    const encoded = encodeURIComponent(slug);
    const res = await fetch(`${API_ENDPOINT}product_details/0?name=${encoded}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.product_id) return null;
    return data;
  } catch (err) {
    console.warn('Server fetch product details failed for slug:', slug, err);
    return null;
  }
});

const getCachedCategories = cache(async (): Promise<CategoryItem[]> => {
  try {
    const res = await fetch(`${API_ENDPOINT}main_categories`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Server fetch main_categories failed:', err);
    return [];
  }
});

const getCachedAltProducts = cache(async (composition: string, excludeProductId?: number) => {
  if (!composition) return [];
  try {
    const [altRes, avgRes] = await Promise.all([
      fetch(`${API_ENDPOINT}alt_products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 1,
          composition: composition,
          exclude_product_id: excludeProductId || null,
          rc: 1,
          show_hidden: false,
        }),
        next: { revalidate: 3600 },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_ENDPOINT}avg_price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ composition, salt_name: '' }),
        next: { revalidate: 3600 },
      }).then((r) => (r.ok ? r.json() : null)),
    ]);

    const avg = parseFloat(avgRes?.averagePrice || 0);
    const results = altRes?.results || [];

    return results
      .filter((x: any) => x.product_pricing_new)
      .map((x: any) => {
        let imgs: string[] = [];
        try {
          const parsed = typeof x.images === 'string' ? JSON.parse(x.images) : x.images;
          if (Array.isArray(parsed)) {
            imgs = parsed
              .map((i: any) => i.img)
              .map((u: string) => formatProductImageUrl(u))
              .filter(Boolean);
          }
        } catch (_) {}

        if (!imgs.length && x.first_image_url) {
          const formatted = formatProductImageUrl(x.first_image_url);
          if (formatted) imgs = [formatted];
        }

        return {
          name: x.product_name,
          manufacturer: x.manufacturer,
          discountedPrice: x.product_pricing_new,
          originalPrice: x.product_pricing_old,
          discount: avg ? Math.max(0, Math.round(((avg - parseFloat(x.product_pricing_new)) / avg) * 100)) : 0,
          imageUrl: imgs[0] || '',
          slides: imgs,
          product_name_url: x.product_name_url,
          product_id: x.product_id,
          composition: x.composition || '',
          packaging: x.packaging || '',
          inStock: x.product_available === 1 || x.product_available === true || x.inStock === true || x.inStock === 1,
          rc: x.rc === undefined ? 1 : Number(x.rc),
        };
      });
  } catch (err) {
    console.warn('Server fetch alt products failed:', err);
    return [];
  }
});

const getCachedFooterProducts = cache(async () => {
  try {
    const res = await fetch(`${API_ENDPOINT}footer-products`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const normalize = (list: any[]) =>
      (list || []).slice(0, 20).map((item: any) => ({
        product_id: item.product_id,
        productName: item.label,
        product_name_url: item.product_name_url,
        productPriceNew: parseFloat(item.product_pricing_new || 0),
        productPriceOld: parseFloat(item.product_pricing_old || 0),
        manufacturer: item.manufacturer || '',
        composition: item.composition || '',
        inStock: item.inStock === true || item.inStock === 1 || item.inStock === '1',
        rc: item.rc === undefined ? 1 : Number(item.rc),
        images: item.first_image_url ? [{ img: formatProductImageUrl(item.first_image_url) }] : [],
      }));

    return normalize(data.frequentlySearchedMedicine);
  } catch (err) {
    console.warn('Server fetch footer products failed:', err);
    return [];
  }
});

const getCachedBlogs = cache(async () => {
  try {
    const res = await fetch(`${API_ENDPOINT}all_blogs?popular=false`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 6) : [];
  } catch (err) {
    console.warn('Server fetch all_blogs failed:', err);
    return [];
  }
});

function replaceProductPlaceholders<T>(data: T, productName: string, saltName: string): T {
  if (typeof data === 'string') {
    return data
      .replace(/[\{\[]+\s*product_name\s*[\}\]]+/gi, productName)
      .replace(/[\{\[]+\s*salt_name\s*[\}\]]+/gi, saltName) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => replaceProductPlaceholders(item, productName, saltName)) as unknown as T;
  }
  if (data !== null && typeof data === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = replaceProductPlaceholders(value, productName, saltName);
    }
    return result;
  }
  return data;
}

function resolveBreadcrumbs(
  selectedCategory: string | undefined,
  productName: string,
  canonicalUrl: string,
  categories: CategoryItem[]
) {
  const items: Array<{ name: string; url: string }> = [
    { name: 'Home', url: 'https://medingen.in' },
  ];

  if (!selectedCategory || !selectedCategory.trim()) {
    items.push({ name: productName, url: canonicalUrl });
    return items;
  }

  const normalizedTarget = selectedCategory.toLowerCase().trim();
  let foundMain: { name: string; slug: string } | null = null;
  let foundSub: { name: string; slug: string } | null = null;

  for (const main of categories) {
    const mainName = main.name?.trim() || '';
    const mainSlug = slugifyCategory(mainName);

    if (mainName.toLowerCase() === normalizedTarget) {
      foundMain = { name: mainName, slug: mainSlug };
      break;
    }

    const subList = main.sub_categories || [];
    const matchedSub = subList.find(
      (sub) => sub.name && sub.name.toLowerCase().trim() === normalizedTarget
    );

    if (matchedSub && matchedSub.name) {
      foundMain = { name: mainName, slug: mainSlug };
      foundSub = { name: matchedSub.name.trim(), slug: slugifyCategory(matchedSub.name) };
      break;
    }
  }

  if (foundMain && foundSub) {
    items.push({
      name: foundMain.name,
      url: `https://medingen.in/categories/${foundMain.slug}`,
    });
    items.push({
      name: foundSub.name,
      url: `https://medingen.in/categories/${foundMain.slug}/${foundSub.slug}`,
    });
  } else if (foundMain) {
    items.push({
      name: foundMain.name,
      url: `https://medingen.in/categories/${foundMain.slug}`,
    });
  } else {
    const fallbackSlug = slugifyCategory(selectedCategory);
    items.push({
      name: selectedCategory.replace(/\b\w/g, (l) => l.toUpperCase()),
      url: `https://medingen.in/categories/${fallbackSlug}`,
    });
  }

  items.push({ name: productName, url: canonicalUrl });
  return items;
}

function parseFaqs(faqs: any[], productName: string, saltName: string, recommendedName?: string) {
  const result: Array<{ question: string; answer: string }> = [];
  if (!Array.isArray(faqs)) return result;

  for (const item of faqs) {
    if (!item) continue;
    const q = (item.question || '').trim();
    const a = (item.answer || '').trim();

    if (q && a) {
      const cleanQ = q
        .replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, productName)
        .replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, saltName)
        .replace(/^\d+[\.\)]\s*/, '')
        .trim();
      const cleanA = a
        .replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, productName)
        .replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, saltName)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanQ && cleanA) {
        result.push({ question: cleanQ, answer: cleanA });
      }
    } else if (!q && a) {
      const blocks = a.split(/(?:^|\n\s*)\d+[\.\)]\s+/).filter(Boolean);
      for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;
        const qMatch = trimmed.match(/^([^\n\?]+\??)(?:\n+([\s\S]+))?$/);
        if (qMatch) {
          const parsedQ = qMatch[1]
            .replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, productName)
            .replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, saltName)
            .replace(/^\d+[\.\)]\s*/, '')
            .trim();
          const parsedA = (qMatch[2] || '')
            .replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, productName)
            .replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, saltName)
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          if (parsedQ && parsedA) {
            result.push({ question: parsedQ, answer: parsedA });
          }
        }
      }
    }
  }

  if (recommendedName && productName) {
    const comparisonQ = `Are ${productName} and ${recommendedName} the same?`;
    const alreadyExists = result.some((f) => f.question.toLowerCase().includes('the same'));
    if (!alreadyExists) {
      result.push({
        question: comparisonQ,
        answer: `Yes, ${productName} and ${recommendedName} contain the same active salt (${saltName || 'the active ingredient'}) in the same strength and provide identical therapeutic efficacy, meeting strict quality and safety standards.`,
      });
    }
  }

  return result;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string | string[] }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug
    ? (Array.isArray(resolvedParams.slug) ? resolvedParams.slug.join('/') : resolvedParams.slug)
    : '';
  const decodedSlug = decodeURIComponent(rawSlug);
  const lastSlugSegment = resolvedParams?.slug
    ? (Array.isArray(resolvedParams.slug) ? decodeURIComponent(resolvedParams.slug[resolvedParams.slug.length - 1]) : decodedSlug)
    : '';

  let productData = await getCachedProduct(decodedSlug);
  if (!productData && lastSlugSegment && lastSlugSegment !== decodedSlug) {
    productData = await getCachedProduct(lastSlugSegment);
  }

  if (!productData || !productData.product_id) {
    return {
      title: 'Product Not Found',
      description: 'The requested medicine or product could not be found on Medingen.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanSlug = extractProductSlug(productData.product_name_url) || decodedSlug;
  const formattedName = productData.productName || cleanSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  const cleanMetaTitle = (productData.meta_title || '')
    .replace(/[\{\[]+\s*product_name\s*[\}\]]+/gi, formattedName)
    .replace(/[\{\[]+\s*salt_name\s*[\}\]]+/gi, productData.composition || '');

  const cleanMetaDesc = (productData.meta_description || '')
    .replace(/[\{\[]+\s*product_name\s*[\}\]]+/gi, formattedName)
    .replace(/[\{\[]+\s*salt_name\s*[\}\]]+/gi, productData.composition || '');

  const strippedTitle = cleanMetaTitle
    .replace(/\s*\|\s*Medingen\s*$/i, '')
    .replace(/\s*-\s*Medingen\s*$/i, '')
    .trim();

  const titleText = strippedTitle || `${formattedName} - Buy Online at Best Price`;
  const socialTitle = `${titleText} | Medingen`;

  const description = cleanMetaDesc.trim()
    ? cleanMetaDesc.trim()
    : `Buy ${formattedName} online at Medingen. Get affordable generic substitutes with same salt composition and quality. Fast doorstep delivery.`;

  const canonical = `https://medingen.in/product/${cleanSlug}`;

  let firstImg: string | undefined;
  if (Array.isArray(productData.images) && productData.images.length > 0) {
    const rawImg = typeof productData.images[0] === 'string' ? productData.images[0] : productData.images[0]?.img;
    if (rawImg) {
      firstImg = formatProductImageUrl(rawImg);
    }
  }
  if (!firstImg && productData.first_image_url) {
    firstImg = formatProductImageUrl(productData.first_image_url);
  }

  const keywords = productData.meta_keywords
    ? productData.meta_keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: titleText,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      url: canonical,
      siteName: 'Medingen',
      locale: 'en_IN',
      images: firstImg ? [{ url: firstImg, alt: formattedName }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: firstImg ? [firstImg] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug?: string | string[] }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug
    ? (Array.isArray(resolvedParams.slug) ? resolvedParams.slug.join('/') : resolvedParams.slug)
    : '';
  const decodedSlug = decodeURIComponent(rawSlug);
  const lastSlugSegment = resolvedParams?.slug
    ? (Array.isArray(resolvedParams.slug) ? decodeURIComponent(resolvedParams.slug[resolvedParams.slug.length - 1]) : decodedSlug)
    : '';

  let rawProductData = await getCachedProduct(decodedSlug);
  if (!rawProductData && lastSlugSegment && lastSlugSegment !== decodedSlug) {
    rawProductData = await getCachedProduct(lastSlugSegment);
  }

  // Proper 404 for missing or invalid products
  if (!rawProductData || !rawProductData.product_id) {
    notFound();
  }

  const [rawFreqMeds, rawAltProducts, categories, blogPosts] = await Promise.all([
    getCachedFooterProducts(),
    rawProductData.composition
      ? getCachedAltProducts(rawProductData.composition, rawProductData.product_id)
      : Promise.resolve([]),
    getCachedCategories(),
    getCachedBlogs(),
  ]);

  const cleanProductSlug = extractProductSlug(rawProductData.product_name_url) || decodedSlug;
  const canonical = `https://medingen.in/product/${cleanProductSlug}`;
  const productName = rawProductData.productName || cleanProductSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  // Replace all [{product_name}] / {[product_name]} placeholders with the SEARCHED product name
  const sanitizedProductData = replaceProductPlaceholders(
    rawProductData,
    productName,
    rawProductData.composition || ''
  );

  // Format data for initial client state with clean relative product paths
  const productData = {
    ...sanitizedProductData,
    product_name_url: formatProductUrl(sanitizedProductData.product_name_url || rawSlug),
  };

  const altProducts = rawAltProducts.map((x: any) => ({
    ...x,
    product_name_url: formatProductUrl(x.product_name_url),
  }));

  const freqMeds = rawFreqMeds.map((item: any) => ({
    ...item,
    product_name_url: formatProductUrl(item.product_name_url),
  }));

  // Build JSON-LD structured data with valid encoded CloudFront URLs
  const productImages: string[] = [];
  if (Array.isArray(rawProductData.images)) {
    rawProductData.images.forEach((imgObj: any) => {
      const imgName = typeof imgObj === 'string' ? imgObj : imgObj?.img;
      const formatted = formatProductImageUrl(imgName);
      if (formatted) productImages.push(formatted);
    });
  }
  if (!productImages.length && rawProductData.first_image_url) {
    const formatted = formatProductImageUrl(rawProductData.first_image_url);
    if (formatted) productImages.push(formatted);
  }

  const cleanDescription = (
    rawProductData.productDescription ||
    rawProductData.meta_description ||
    rawProductData.used_for ||
    `${productName} details, composition, dosage, and substitute medicines at Medingen.`
  )
    .replace(/[\[\{]+\s*product_name\s*[\]\}]+/gi, productName)
    .replace(/[\[\{]+\s*salt_name\s*[\]\}]+/gi, rawProductData.composition || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const inStock =
    rawProductData.inStock === true ||
    rawProductData.inStock === 1 ||
    rawProductData.inStock === '1' ||
    rawProductData.product_available === 1 ||
    rawProductData.product_available === true;

  const priceValue = parseFloat(rawProductData.productPriceNew || rawProductData.productPriceOld || 0).toFixed(2);
  const brandName = rawProductData.brand || rawProductData.marketed_by || rawProductData.manufacturer || 'Medingen';
  const manufacturerName = rawProductData.manufacturer;

  const productSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: productImages.length ? productImages : undefined,
    description: cleanDescription,
    sku: String(rawProductData.product_id),
    mpn: rawProductData.rc_pharma_product_name || String(rawProductData.product_id),
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    ...(manufacturerName ? {
      manufacturer: {
        '@type': 'Organization',
        name: manufacturerName,
      },
    } : {}),
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'INR',
      price: priceValue,
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Medingen',
        url: 'https://medingen.in',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        url: 'https://medingen.in/policies-return-policy',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
      ...(rawProductData.priceValidUntil || rawProductData.price_valid_until ? {
        priceValidUntil: rawProductData.priceValidUntil || rawProductData.price_valid_until,
      } : {}),
    },
  };

  const ratingValue = Number(rawProductData.rating || rawProductData.averageRating);
  const reviewCount = Number(rawProductData.reviewCount || rawProductData.totalReviews);
  if (!isNaN(ratingValue) && ratingValue > 0 && !isNaN(reviewCount) && reviewCount > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount: Math.round(reviewCount),
    };
  }

  // Build Breadcrumbs from real category hierarchy
  const breadcrumbItems = resolveBreadcrumbs(
    rawProductData.selectedCategory,
    productName,
    canonical,
    categories
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const recommendedName = rawAltProducts?.[0]?.name;
  const parsedFaqs = parseFaqs(rawProductData.faq, productName, rawProductData.composition || '', recommendedName);
  let faqSchema: Record<string, any> | null = null;
  if (parsedFaqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: parsedFaqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
  }

  return (
    <>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      {faqSchema && (
        <script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <template
        id="server-initial-product"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productData).replace(/</g, '\\u003c'),
        }}
      />
      {altProducts.length > 0 && (
        <template
          id="server-initial-alts"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(altProducts).replace(/</g, '\\u003c'),
          }}
        />
      )}
      {freqMeds.length > 0 && (
        <template
          id="server-initial-freq-meds"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(freqMeds).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <SearchViewMedicine
        initialProductData={productData}
        initialSlug={cleanProductSlug}
        initialAltProducts={altProducts}
        initialFreqMeds={freqMeds}
        initialBlogs={blogPosts}
        breadcrumbs={breadcrumbItems}
      />
    </>
  );
}


