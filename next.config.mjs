import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1dh0rr5xj2p49.cloudfront.net',
      },
      {
        protocol: 'http',
        hostname: 'medingen-portal-new.s3-website.ap-south-1.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/policies-privacy-policy',
        permanent: true,
      },
      {
        source: '/return-policy',
        destination: '/policies-return-policy',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/policies-terms-and-conditions',
        permanent: true,
      },
      {
        source: '/grievance-policy',
        destination: '/policies-grievance-redressal-policy',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      {
        source: '/product_name/:name*',
        destination: '/product/:name*',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/categories/:slug*',
        permanent: true,
      },
      {
        source: '/salt_name/:name*',
        destination: '/salt/:name*',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve('./src/lib/router-compat.tsx');
    config.resolve.alias['react-helmet'] = path.resolve('./src/lib/helmet-compat.tsx');
    config.resolve.alias['react-helmet-async'] = path.resolve('./src/lib/helmet-compat.tsx');
    if (config.output) {
      config.output.chunkLoadTimeout = 300000;
    }
    return config;
  },
};

export default nextConfig;
