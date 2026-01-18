"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleById } from '@/lib/knowledge-storage';
import { Article } from '@/types/knowledge';

export default function FreeArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState(null as Article | null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const found = getArticleById(id);
    setArticle(found);
  }, [params.id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-6">您访问的文章不存在或已被删除</p>
          <Link
            href="/knowledge/free"
            className="btn bg-primary-600 text-white px-6 py-2 rounded-lg"
          >
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-12">
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
            <li>
              <Link href="/knowledge/free" className="text-gray-500 hover:text-gray-900">
                免费文章
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-4">
            <span className="text-sm font-medium text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <span>{article.publishDate}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} 分钟阅读</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
          </div>
        </div>

        {/* Article Navigation */}
        <nav className="mt-12 flex justify-between">
          <Link
            href="/knowledge/free"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </Link>
        </nav>
      </article>
    </div>
  );
}
