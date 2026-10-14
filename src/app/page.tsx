import React, { cache } from 'react';
import Dashboard from '@/features/home/Dashboard/Dashboard';
import { extractProductSlug } from '@/utils/url';

export const metadata = {
  title: {
    absolute: 'Buy Generic Medicines Online | Trusted Store - Medingen',
  },
  description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India. Shop online for trusted and quality healthcare products.',
  alternates: {
    canonical: 'https://medingen.in/',
  },
  openGraph: {
    title: 'Buy Generic Medicines Online | Trusted Store - Medingen',
    description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India. Shop online for trusted and quality healthcare products.',
    type: 'website',
    url: 'https://medingen.in/',
    siteName: 'Medingen',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Generic Medicines Online | Trusted Store - Medingen',
    description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India.',
  },
};

const normalizeFooterList = (list: any[]) => {
  return (list || []).slice(0, 20).map((item: any) => ({
    product_id: item.product_id,
    productName: item.label,
    product_name_url: extractProductSlug(item.product_name_url),
    productPriceNew: parseFloat(item.product_pricing_new || 0),
    productPriceOld: parseFloat(item.product_pricing_old || 0),
    manufacturer: item.manufacturer || '',
    inStock: item.inStock === true || item.inStock === 1 || item.inStock === '1',
    rc: item.rc === undefined ? 1 : Number(item.rc),
    images: item.first_image_url ? [{ img: item.first_image_url }] : [],
  }));
};

const getHomepageFooterProducts = cache(async () => {
  try {
    const res = await fetch('https://medingen.in/api/footer-products', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      topSellingMedicines: normalizeFooterList(data.topSellingMedicines),
      dealsForTheDay: normalizeFooterList(data.dealsForTheDay),
      frequentlySearchedMedicine: normalizeFooterList(data.frequentlySearchedMedicine),
      popularMedicine: normalizeFooterList(data.popularMedicine),
    };
  } catch (err) {
    console.warn('Server fetch footer-products failed:', err);
    return null;
  }
});

const getHomepageBanners = cache(async () => {
  try {
    const res = await fetch('https://medingen.in/api/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'home_banner' }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Server fetch banner failed:', err);
    return [];
  }
});

const getHomepageCategories = cache(async () => {
  try {
    const [mainRes, allRes] = await Promise.all([
      fetch('https://medingen.in/api/main_categories', { next: { revalidate: 3600 } }),
      fetch('https://medingen.in/api/all_categories', { next: { revalidate: 3600 } }),
    ]);

    const hierarchy = mainRes.ok ? await mainRes.json() : [];
    const allCatData = allRes.ok ? await allRes.json() : [];

    let formattedData: any[] = [];
    if (Array.isArray(hierarchy) && hierarchy.length > 0) {
      formattedData = hierarchy.map((cat: any) => {
        const rawSubCats = cat.sub_categories || cat.subcategories || cat.children || cat.items || [];
        const subCatsArray = Array.isArray(rawSubCats) ? rawSubCats : [];
        return {
          title: cat.name || cat.category_name || cat.title,
          items: subCatsArray
            .map((s: any) => {
              if (typeof s === 'string') return { name: s, image: null };
              return {
                name: s.name || s.category_name || s.title || '',
                image: s.image || s.category_image_url || null,
              };
            })
            .filter((s: any) => s.name !== ''),
        };
      });

      const priorityOrder = [
        'Personal Care',
        'Health Conditions',
        'Vitamins & Supplements',
        'Diabetes Care',
        'Chronic Care',
      ];

      formattedData.sort((a: any, b: any) => {
        const indexA = priorityOrder.indexOf(a.title);
        const indexB = priorityOrder.indexOf(b.title);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        return a.title.localeCompare(b.title);
      });
    }

    return {
      dynamicCategoryData: formattedData,
      allCategories: Array.isArray(allCatData) ? allCatData : [],
    };
  } catch (err) {
    console.warn('Server fetch categories failed:', err);
    return {
      dynamicCategoryData: [],
      allCategories: [],
    };
  }
});

const getHomepageReviews = cache(async () => {
  try {
    const res = await fetch('https://featurable.com/api/v1/widgets/fb210dba-0301-4000-982d-6e8006ca39f3', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success) {
      const sorted = (data.reviews || []).sort(
        (a: any, b: any) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
      return {
        rating: Number(data.averageRating).toFixed(1),
        count: data.totalReviewCount.toLocaleString(),
        reviews: sorted,
      };
    }
    return null;
  } catch (err) {
    console.warn('Server fetch reviews failed:', err);
    return null;
  }
});

export default async function HomePage() {
  const [footerData, banners, categoryData, reviewsData] = await Promise.all([
    getHomepageFooterProducts(),
    getHomepageBanners(),
    getHomepageCategories(),
    getHomepageReviews(),
  ]);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Medingen',
    url: 'https://medingen.in',
    logo: 'https://medingen.in/Medingen_logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7090123709',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Medingen',
    url: 'https://medingen.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://medingen.in/search-results?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        id="org-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        id="website-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema).replace(/</g, '\\u003c'),
        }}
      />
      <Dashboard
        initialBanners={banners}
        initialFooterProducts={footerData}
        initialDynamicCategories={categoryData.dynamicCategoryData}
        initialAllCategories={categoryData.allCategories}
        initialReviewsData={reviewsData}
      />
    </>
  );
}
