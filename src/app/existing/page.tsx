import React from 'react';
import { ExistingUser } from '@/features/auth/ExistingUser/ExistingUser';

export const metadata = {
  title: 'Existing User',
  robots: { index: false, follow: false },
};

export default function ExistingUserPage() {
  return <ExistingUser />;
}
