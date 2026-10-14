"use client";
import React, { useState, useEffect } from 'react';
import { Reminder } from '@/features/reminders/Reminder/Reminder';

export default function ReminderPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <Reminder />;
}
