import React from 'react';
import { UploadPrescription } from '@/features/checkout/UploadPrescription/UploadPrescription';

export const metadata = {
  title: 'Upload Prescription',
  robots: { index: false, follow: false },
};

export default function UploadPrescriptionPage() {
  return <UploadPrescription />;
}
