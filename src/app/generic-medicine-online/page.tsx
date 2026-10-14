import React from 'react';
import GenericMedicineOnline from '@/features/products/GenericMedicineOnline/GenericMedicineOnline';

export const metadata = {
  title: 'Generic Medicines Online - Affordable Healthcare',
  description: 'Buy affordable, FDA-approved generic medicines online at Medingen. Same salt composition, same effectiveness, up to 80% savings.',
  alternates: {
    canonical: 'https://medingen.in/generic-medicine-online',
  },
  openGraph: {
    title: 'Generic Medicines Online | Quality, Affordable Healthcare - Medingen',
    description: 'Buy affordable, FDA-approved generic medicines online at Medingen. Same salt composition, same effectiveness, up to 80% savings.',
    url: 'https://medingen.in/generic-medicine-online',
  },
};

export default function GenericMedicinePage() {
  return <GenericMedicineOnline />;
}
