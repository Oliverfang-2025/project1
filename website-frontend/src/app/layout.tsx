import React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// 使用本地字体替代Google Fonts的Inter字体
const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-regular-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-medium-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-semibold-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-bold-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// 注释掉不存在的字体配置
// const myFont = localFont({
//   src: [
//     {
//       path: '../../public/fonts/your-font-regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/your-font-bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   display: 'swap',
//   preload: true,
// })

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
    <html lang="zh-CN" className={inter.variable}>
      <head>
        {/* 预加载字体 */}
        <link
          rel="preload"
          href="/fonts/inter-regular-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-medium-UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
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