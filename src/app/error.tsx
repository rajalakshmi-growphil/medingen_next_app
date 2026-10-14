"use client";
import React, { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

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
      <h2 style={{ fontSize: '28px', color: '#5D399B', marginBottom: '12px' }}>Something went wrong!</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: '#5D399B',
          color: '#fff',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '24px',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
