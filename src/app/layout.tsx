"use client";

import React from 'react';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DifyChat from '@/components/DifyChat';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <DifyChat />
      </body>
    </html>
  );
} 