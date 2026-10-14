import React from 'react';
import { CapturePrescription } from '@/features/checkout/CapturePrescription/CapturePrescription';

export const metadata = {
  title: 'Capture Prescription',
  robots: { index: false, follow: false },
};

export default function CapturePrescriptionPage() {
  return <CapturePrescription />;
}
