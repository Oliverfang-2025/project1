"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// 动态导入导航栏组件，不进行服务器端渲染
const Navbar = dynamic(() => import('@/app/navbar/page'), { ssr: false });

export default function Header() {
  return (
    <header>
      <Navbar />
    </header>
  );
} 