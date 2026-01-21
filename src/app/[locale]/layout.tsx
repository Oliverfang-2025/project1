"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function LocaleLayout({
  children,
}: {
  children: any;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {!isAdmin && <Header />}
      <main className={isAdmin ? '' : 'flex-grow'}>{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
}
