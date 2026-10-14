import React from 'react';
import { CreatePassword } from '@/features/auth/CreatePassword/CreatePassword';

export const metadata = {
  title: 'Create Password',
  robots: { index: false, follow: false },
};

export default function CreatePasswordPage() {
  return <CreatePassword />;
}
