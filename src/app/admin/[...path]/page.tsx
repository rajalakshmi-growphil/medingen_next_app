"use client";
import { useEffect } from 'react';

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = 'http://medingen-portal-new.s3-website.ap-south-1.amazonaws.com/sign-in';
  }, []);

  return (
    <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
      Redirecting to Medingen Admin Portal...
    </div>
  );
}
