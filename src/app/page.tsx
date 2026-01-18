"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getVisibleSections } from '@/lib/section-storage';
import SectionRenderer from '@/components/home/SectionRenderer';
import { SectionConfig } from '@/types/section-config';
import { DEFAULT_SECTIONS } from '@/types/section-config';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState(DEFAULT_SECTIONS as SectionConfig[]);
  const [mounted, setMounted] = useState(false);

  // Load sections config only on client side
  useEffect(() => {
    setMounted(true);
    setVisibleSections(getVisibleSections());
  }, []);

  // Don't render dynamic content until mounted on client
  if (!mounted) {
    return (
      <>
        {/* 现代风格的欢迎横幅 */}
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-700 opacity-90"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
          <div className="container relative z-10 mx-auto px-4 text-white">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                您好，我是 <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Oliver Fang</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-white/80 leading-relaxed">
                半导体/集成电路行业生产管理专家，热爱技术与创新
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="px-8 py-3 rounded-full bg-white text-primary-600 font-medium hover:bg-white/90 transition-colors"
                >
                  了解更多
                </Link>
                <Link
                  href="/plans"
                  className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
                >
                  职业规划
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 right-10 opacity-70">
            <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-md"></div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>
        <div className="space-y-24 py-20">
          {DEFAULT_SECTIONS.map(section => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* 现代风格的欢迎横幅 */}
      <section className="relative h-screen flex items-center">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-700 opacity-90"></div>
        
        {/* 背景图案 - 可选 */}
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        
        {/* 内容 */}
        <div className="container relative z-10 mx-auto px-4 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              您好，我是 <br />
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Oliver Fang</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 leading-relaxed">
              半导体/集成电路行业生产管理专家，热爱技术与创新
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/about" 
                className="px-8 py-3 rounded-full bg-white text-primary-600 font-medium hover:bg-white/90 transition-colors"
              >
                了解更多
              </Link>
              <Link 
                href="/plans" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
              >
                职业规划
              </Link>
            </div>
          </div>
        </div>
        
        {/* 装饰元素 - 右下角 */}
        <div className="absolute bottom-10 right-10 opacity-70">
          <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-md"></div>
        </div>
        
        {/* 下滑提示 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <div className="space-y-24 py-20">
        {/* 动态渲染板块 */}
        {visibleSections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </>
  );
} 