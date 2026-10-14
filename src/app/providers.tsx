"use client";
import React from 'react';
import { AppProviders } from '../contexts/AppProviders';

if (typeof window !== 'undefined' && typeof Node === 'function') {
  const oR = Node.prototype.removeChild;
  Node.prototype.removeChild = function (c: any) {
    if (c && c.parentNode !== this) {
      return c;
    }
    return oR.apply(this, arguments as any);
  };
  const oI = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (n: any, r: any) {
    if (r && r.parentNode !== this) {
      return n;
    }
    return oI.apply(this, arguments as any);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}

