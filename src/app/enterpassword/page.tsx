import React from 'react';
import { EnterPassword } from '@/features/auth/EnterPassword/EnterPassword';

export const metadata = {
  title: 'Enter Password',
  robots: { index: false, follow: false },
};

export default function EnterPasswordPage() {
  return <EnterPassword />;
}
