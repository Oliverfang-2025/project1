"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFreeArticles, getPaidArticles } from '@/lib/knowledge-storage';
import { Article } from '@/types/knowledge';

export default function KnowledgeSection() {
  const [freeArticles, setFreeArticles] = useState<Article[]>([]);
  const [paidArticles, setPaidArticles] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFreeArticles(getFreeArticles().slice(0, 3)); // 只显示前3篇
    setPaidArticles(getPaidArticles().slice(0, 2)); // 只显示前2篇
  }, []);

  return (
    <section id="knowledge" className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">知识库</h2>
          <p className="section-subtitle">分享我的技术见解和专业知识</p>
        </div>

        {/* 免费知识库 */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">免费知识库</h3>
            <Link 
              href="/knowledge/free" 
              className="text-primary font-medium hover:text-primary-dark"
            >
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {freeArticles.map((article) => (
              <div key={article.id} className="card overflow-hidden hover:shadow-lg transition">
                <div className="w-full h-48 bg-gray-200 relative mb-4">
                  {/* 使用占位图，实际开发时替换为真实图片 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                    {article.category}
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {article.publishDate} • {article.readTime} 分钟阅读
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary">
                  <Link href={`/knowledge/free/${article.id}`}>
                    {article.title}
                  </Link>
                </h4>
                
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                
                <Link 
                  href={`/knowledge/free/${article.id}`}
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  阅读全文 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 付费知识库 */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">付费专栏</h3>
            <Link 
              href="/knowledge/paid" 
              className="text-primary font-medium hover:text-primary-dark"
            >
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paidArticles.map((article) => (
              <div key={article.id} className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* 缩略图 */}
                <div className="w-1/3 bg-gray-200 relative">
                  {/* 使用占位图，实际开发时替换为真实图片 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                    {article.category}
                  </div>
                </div>
                
                {/* 内容 */}
                <div className="w-2/3 p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {article.publishDate}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary">
                    <Link href={`/knowledge/paid/${article.id}`}>
                      {article.title}
                    </Link>
                  </h4>
                  
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">¥{article.price}</span>
                    <Link 
                      href={`/knowledge/paid/${article.id}`}
                      className="btn px-4 py-1 text-sm"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 