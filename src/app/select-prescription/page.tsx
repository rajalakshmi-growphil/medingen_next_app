import React from 'react';
import { SelectPrescription } from '@/features/checkout/SelectPrescription/SelectPrescription';

export const metadata = {
  title: 'Select Prescription',
  robots: { index: false, follow: false },
};

export default function SelectPrescriptionPage() {
  return <SelectPrescription />;
}
