import React from 'react';
import { PersonalInfo } from '@/features/profile/PersonalInfo/PersonalInfo';

export const metadata = {
  title: 'Personal Info',
  robots: { index: false, follow: false },
};

export default function PersonalInfoPage() {
  return <PersonalInfo />;
}
