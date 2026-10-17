"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './not-found.module.css';

export default function NotFoundSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search-results?query=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/searchbox');
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <div className={styles.searchIcon}>
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
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search medicines, healthcare products..."
        className={styles.searchInput}
        aria-label="Search medicines, healthcare products"
      />

      <button type="submit" className={styles.searchBtn}>
        Search
      </button>
    </form>
  );
}
