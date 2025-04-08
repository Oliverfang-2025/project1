"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
} 