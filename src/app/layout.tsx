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
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}} />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>

        {/* Dify聊天机器人集成 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.difyChatbotConfig = {
                token: 'uluSs0xDCF8cY734',
                systemVariables: {},
              }
            `
          }}
        />
        <script
          src="https://udify.app/embed.min.js"
          id="uluSs0xDCF8cY734"
          defer
        />
      </body>
    </html>
  );
} 