import React from 'react';
import { AddressNew } from '@/features/profile/AddressNew/AddressNew';

export const metadata = {
  title: 'Add New Address',
  robots: { index: false, follow: false },
};

export default function AddressNewPage() {
  return <AddressNew />;
}
