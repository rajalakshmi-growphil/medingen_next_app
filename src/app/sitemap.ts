import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://medingen.in';

  // 1. Core High-Priority Pages
  const mainStaticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/generic-medicine-online`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. Legal Policy Pages
  const policyRoutes: MetadataRoute.Sitemap = [
    '/policies-privacy-policy',
    '/policies-terms-and-conditions',
    '/policies-grievance-redressal-policy',
    '/policies-return-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2024-01-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  // 3. Category Slugs (curated fallback + dynamic main categories)
  const defaultCategorySlugs = [
    'cardiac',
    'diabetic',
    'pain-relief',
    'gastrointestinal',
    'antibiotics',
    'personal-care',
    'vitamins-and-supplements',
    'chronic-care',
    'health-conditions',
    'diabetes-care',
  ];

  let categorySlugs = defaultCategorySlugs;
  try {
    const catRes = await fetch('https://medingen.in/api/main_categories', {
      next: { revalidate: 86400 },
    });
    if (catRes.ok) {
      const data = await catRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const fetchedSlugs = data
          .map((c: any) =>
            (c.name || c.category_name || '')
              .toLowerCase()
              .trim()
              .replace(/&/g, 'and')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          )
          .filter(Boolean);
        if (fetchedSlugs.length > 0) {
          categorySlugs = Array.from(new Set([...defaultCategorySlugs, ...fetchedSlugs]));
        }
      }
    }
  } catch (err) {
    console.warn('Sitemap categories fetch fallback used:', err);
  }

  const categoryEntries: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Products (popular + curated products with footer-products API augmentation)
  const defaultProductSlugs = [
    'pantosec-40mg',
    'azicip-500mg',
    'dolo-650mg',
    'paracip-500mg',
    'azicip-250mg',
    'olox-200mg',
    'pantosec-dsr-30-40mg',
    'alergin-l-5mg',
    'amoxyclav-500-125mg',
    'rabesec-dsr-30-20mg',
    'pan-40mg',
    'montek-lc',
    'augmentin-625-duo',
    'telma-40mg',
    'glycomet-gp-1',
    'shelcal-500mg',
    'evion-400mg',
    'becosules-capsules',
    'limcee-500mg',
    'zifi-200mg',
  ];

  let productSlugs = defaultProductSlugs;
  try {
    const prodRes = await fetch('https://medingen.in/api/footer-products', {
      next: { revalidate: 86400 },
    });
    if (prodRes.ok) {
      const pData = await prodRes.json();
      const extracted: string[] = [];
      const lists = [
        pData.topSellingMedicines,
        pData.dealsForTheDay,
        pData.frequentlySearchedMedicine,
        pData.popularMedicine,
      ];
      for (const list of lists) {
        if (Array.isArray(list)) {
          for (const item of list) {
            const raw = item.product_name_url || item.label || '';
            const slug = raw
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');
            if (slug) extracted.push(slug);
          }
        }
      }
      if (extracted.length > 0) {
        productSlugs = Array.from(new Set([...defaultProductSlugs, ...extracted]));
      }
    }
  } catch (err) {
    console.warn('Sitemap products fetch fallback used:', err);
  }

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 5. Salts
  const defaultSaltSlugs = [
    'paracetamol',
    'pantoprazole',
    'azithromycin',
    'ofloxacin',
    'amoxicillin-and-clavulanic-acid',
    'telmisartan',
    'metformin',
    'atorvastatin',
    'montelukast-and-levocetirizine',
    'omeprazole',
    'rabeprazole',
    'rosuvastatin',
  ];

  const saltEntries: MetadataRoute.Sitemap = defaultSaltSlugs.map((slug) => ({
    url: `${baseUrl}/salt/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 6. Blogs
  const blogSlugs = [
    'vitamin-k-rich-foods',
    'generic-vs-branded-medicines',
    'safe-online-medicine-buying-guide',
  ];

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...mainStaticRoutes,
    ...policyRoutes,
    ...categoryEntries,
    ...productEntries,
    ...saltEntries,
    ...blogEntries,
  ];
}
