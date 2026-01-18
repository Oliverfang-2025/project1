"use client";

import React from 'react';
import Link from 'next/link';

export default function PaidKnowledgePage() {
  const articles = [
    {
      id: 101,
      title: '高级系统架构设计',
      excerpt: '从零开始设计高可用、可扩展的系统架构',
      category: '系统架构',
      price: 29.9,
      publishDate: '2023-04-10',
      features: ['高可用性设计', '微服务架构', '性能优化', '监控告警'],
    },
    {
      id: 102,
      title: '微服务实战指南',
      excerpt: '微服务架构的实际实施步骤和经验分享',
      category: '系统架构',
      price: 39.9,
      publishDate: '2023-05-20',
      features: ['服务拆分', 'API 网关', '服务发现', '容器化部署'],
    },
  ];

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
            <li className="text-gray-900">付费专栏</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">付费专栏</h1>
          <p className="text-xl text-gray-600">
            深度内容和实战经验，助你突破技术瓶颈
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm text-white/80">{article.publishDate}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-white/90">{article.excerpt}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">课程内容：</h3>
                  <ul className="space-y-2">
                    {article.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-3xl font-bold text-primary-600">¥{article.price}</span>
                    <span className="text-gray-500 ml-2">/专栏</span>
                  </div>
                  <Link
                    href={`/knowledge/paid/${article.id}`}
                    className="btn bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex">
            <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-green-900 font-semibold mb-1">购买说明</h3>
              <p className="text-green-800 text-sm">
                所有付费专栏均支持永久访问，内容持续更新。购买后可通过邮箱联系获取更多学习资源。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
