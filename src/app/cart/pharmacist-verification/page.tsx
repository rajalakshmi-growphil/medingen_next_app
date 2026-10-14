import React from 'react';
import { PharmacistVerification } from '@/features/cart/PharmacistVerification/PharmacistVerification';

export const metadata = {
  title: 'Pharmacist Verification',
  robots: { index: false, follow: false },
};

export default function PharmacistVerificationPage() {
  return <PharmacistVerification />;
}
