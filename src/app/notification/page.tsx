import React from 'react';
import { Notifications } from '@/features/notifications/Notifications/Notifications';

export const metadata = {
  title: 'Notifications',
  robots: { index: false, follow: false },
};

export default function NotificationPage() {
  return <Notifications />;
}
