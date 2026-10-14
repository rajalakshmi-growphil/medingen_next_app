import React from 'react';
import { CreateProfile } from '@/features/auth/CreateProfile/CreateProfile';

export const metadata = {
  title: 'Create Profile',
  robots: { index: false, follow: false },
};

export default function CreateProfilePage() {
  return <CreateProfile />;
}
