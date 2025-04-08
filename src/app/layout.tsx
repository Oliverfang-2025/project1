import React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oliver Fang - 半导体/集成电路行业生产管理专家',
  description: '半导体行业15年工作经验，专注于生产管理、测试厂建设与IT系统规划，分享专业知识与职业经验',
};

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
      </body>
    </html>
  );
} 