import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        fontFamily: 'Outfit, sans-serif',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '72px', color: '#5D399B', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Page Not Found</h2>
      <p style={{ color: '#666', maxWidth: '400px', marginBottom: '24px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: '#5D399B',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '24px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
