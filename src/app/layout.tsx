"use client";

import React from 'react';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DifyChat from '@/components/DifyChat';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {!isAdmin && <Header />}
          <main className={isAdmin ? '' : 'flex-grow'}>{children}</main>
          {!isAdmin && <Footer />}
        </div>
        {!isAdmin && <DifyChat />}
      </body>
    </html>
  );
} 