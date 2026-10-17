import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import NotFoundSearch from './NotFoundSearch';
import NotFoundPrescriptionCard from './NotFoundPrescriptionCard';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page Not Found | Medingen',
  description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {

  return (
    <div className={styles.container}>
      {/* Top Brand Bar */}
      <header className={styles.topBar}>
        <Link href="/" className={styles.logoLink} aria-label="Medingen Home">
          <img
            src="/migfulllogo.svg"
            alt="Medingen"
            width={38}
            height={38}
            className={styles.logoImg}
          />
          <span className={styles.brandTitle}>Medingen</span>
        </Link>
        <div className={styles.topBarRight}>
          <Link href="/help-center" className={styles.helpLink}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Need Help?</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Hero: 404 3D Illustration + Text Content */}
        <div className={styles.heroSection}>
          {/* Left Column: 3D Cute 404 Illustration */}
          <div className={styles.illustrationCol}>
            <div className={styles.illustrationWrapper}>
              <picture>
                <source srcSet="/404-illustration.webp" type="image/webp" />
                <img
                  src="/404-illustration.png"
                  alt="404 Page Not Found - Medingen"
                  className={styles.illustrationImg}
                  width={480}
                  height={360}
                />
              </picture>
            </div>
          </div>

          {/* Right Column: Information, Search, and Navigation */}
          <div className={styles.contentCol}>
            <div className={styles.oopsBadge}>Oops!</div>

            <h1 className={styles.title}>Page Not Found</h1>

            <p className={styles.description}>
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </p>

            {/* Search Input Form */}
            <NotFoundSearch />

            {/* Back to Home Button */}
            <Link href="/" className={styles.homeBtn}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Popular Pages */}
        <section className={styles.popularSection}>
          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Popular Pages</span>
          </div>

          <div className={styles.cardsGrid}>
            {/* Card 1: Browse Medicines */}
            <Link href="/generic-medicine-online" className={styles.popularCard}>
              <div
                className={styles.cardIconCircle}
                style={{ backgroundColor: '#F3E8FF', color: '#7E22CE' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                  <path d="m8.5 8.5 7 7" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Browse Medicines</h3>
                <p className={styles.cardSubtitle}>View all products</p>
              </div>
              <div className={styles.cardArrow}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>

            {/* Card 2: Shop by Category */}
            <Link href="/categories" className={styles.popularCard}>
              <div
                className={styles.cardIconCircle}
                style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Shop by Category</h3>
                <p className={styles.cardSubtitle}>Explore categories</p>
              </div>
              <div className={styles.cardArrow}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>

            {/* Card 3: Upload Prescription (opens popup modal without navigating) */}
            <NotFoundPrescriptionCard />

            {/* Card 4: Need Help? */}
            <Link href="/help-center" className={styles.popularCard}>
              <div
                className={styles.cardIconCircle}
                style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Need Help?</h3>
                <p className={styles.cardSubtitle}>Contact our support</p>
              </div>
              <div className={styles.cardArrow}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
