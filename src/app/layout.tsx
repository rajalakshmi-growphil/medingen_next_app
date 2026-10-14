import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'animate.css/animate.min.css';
import '../index.css';
import '../App.css';
import { Providers } from './providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://medingen.in'),
  title: {
    default: 'Buy Generic Medicines Online | Trusted Store - Medingen',
    template: '%s | Medingen',
  },
  description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India. Shop online for trusted and quality healthcare products.',
  keywords: ['generic medicines', 'buy medicines online', 'affordable pharmacy', 'doorstep delivery', 'medingen', 'generic pharmacy India'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/android-chrome-180x180.jpg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://medingen.in',
    siteName: 'Medingen',
    title: 'Buy Generic Medicines Online | Trusted Store - Medingen',
    description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India. Shop online for trusted and quality healthcare products.',
    images: [
      {
        url: 'https://medingen.in/Medingen.jpg',
        width: 1200,
        height: 630,
        alt: 'Medingen - Generic Medicines Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Generic Medicines Online | Trusted Store - Medingen',
    description: 'Medingen offers affordable generic medicines and fast doorstep delivery across India.',
    images: ['https://medingen.in/Medingen.jpg'],
  },
  verification: {
    other: {
      'facebook-domain-verification': ['g8ql8ny8w5r6zoq77kl4t0oedt8kjk'],
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WSS9HN62');`,
          }}
        />
        <Script
          id="gtag-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-7031KQLTP7"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7031KQLTP7', { page_path: window.location.pathname });`,
          }}
        />
        <script
          id="dom-patch"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=='undefined'&&typeof Node==='function'){var oR=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c&&c.parentNode!==this){return c;}return oR.apply(this,arguments);};var oI=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,r){if(r&&r.parentNode!==this){return n;}return oI.apply(this,arguments);};}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <div className="App">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
