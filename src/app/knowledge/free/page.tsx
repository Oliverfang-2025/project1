"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFreeArticles } from '@/lib/knowledge-storage';
import { Article } from '@/types/knowledge';

export default function FreeKnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setArticles(getFreeArticles());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                首页
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/knowledge" className="text-gray-500 hover:text-gray-900">
                知识库
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">免费文章</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">免费知识库</h1>
          <p className="text-xl text-gray-600">
            免费的技术文章和教程，帮助你快速提升技能
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
            >
              {/* Image placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <span className="text-2xl font-bold opacity-50">{article.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {article.publishDate} • {article.readTime} 分钟阅读
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  <Link href={`/knowledge/free/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <Link
                  href={`/knowledge/free/${article.id}`}
                  className="text-primary font-medium hover:text-primary-dark inline-flex items-center group-hover:translate-x-2 transition-transform"
                >
                  阅读全文 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            <strong>更多文章正在筹备中...</strong>
            <br />
            <span className="text-sm">敬请期待更多优质内容</span>
          </p>
        </div>
      </div>
    </div>
  );
}
