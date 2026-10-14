import React from 'react';
import { SavedAddress } from '@/features/profile/SavedAddress/SavedAddress';

export const metadata = {
  title: 'Saved Addresses',
  robots: { index: false, follow: false },
};

export default function SavedAddressPage() {
  return <SavedAddress />;
}
