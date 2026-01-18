"use client";

import React from 'react';
import Link from 'next/link';

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">知识库</h1>
            <p className="text-xl text-white/90">
              分享我的技术见解和专业知识，涵盖前端开发、后端开发、系统架构等多个领域
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 免费知识库 */}
            <Link
              href="/knowledge/free"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition group"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                    免费知识库
                  </h2>
                  <p className="text-gray-600">
                    免费的技术文章和教程，帮助你快速提升技能
                  </p>
                  <div className="mt-4 text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                    浏览文章 →
                  </div>
                </div>
              </div>
            </Link>

            {/* 付费专栏 */}
            <Link
              href="/knowledge/paid"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition group"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-secondary-600 transition">
                    付费专栏
                  </h2>
                  <p className="text-gray-600">
                    深度内容和实战经验，助你突破技术瓶颈
                  </p>
                  <div className="mt-4 text-secondary-600 font-medium group-hover:translate-x-2 transition-transform">
                    查看专栏 →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
              <div className="text-gray-600">免费文章</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-600 mb-2">5+</div>
              <div className="text-gray-600">付费专栏</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">阅读人次</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
