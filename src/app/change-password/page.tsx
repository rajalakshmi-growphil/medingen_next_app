import React from 'react';
import { ChangePassword } from '@/features/profile/ChangePassword/ChangePassword';

export const metadata = {
  title: 'Change Password',
  robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
