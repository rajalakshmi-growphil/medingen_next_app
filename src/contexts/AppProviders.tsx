"use client";
import React from 'react';
import { CartProvider, CompareProvider, ProfileProvider } from '@/api/stateContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CompareProvider>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </CompareProvider>
    </CartProvider>
  );
}
