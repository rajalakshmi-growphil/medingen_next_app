import React from 'react';
import { LandingPage } from '@/features/cart/LandingPage/LandingPage';

export const metadata = {
  title: 'About Us - Trusted Online Generic Pharmacy',
  description: 'Learn about Medingen mission to provide quality generic medicines at affordable prices across India.',
  alternates: {
    canonical: 'https://medingen.in/about',
  },
  openGraph: {
    title: 'About Medingen | Trusted Online Generic Pharmacy',
    description: 'Learn about Medingen mission to provide quality generic medicines at affordable prices across India.',
    url: 'https://medingen.in/about',
  },
};

export default function AboutPage() {
  return <LandingPage />;
}
