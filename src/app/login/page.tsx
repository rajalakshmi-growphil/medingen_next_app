import React from 'react';
import { Login1 } from '@/features/auth/Login1/Login1';

export const metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <Login1 />;
}
