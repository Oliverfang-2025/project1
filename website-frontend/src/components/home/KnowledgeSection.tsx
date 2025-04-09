"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function KnowledgeSection() {
  // 示例知识库数据，实际开发中可从API获取
  const freeArticles = [
    {
      id: 1,
      title: '前端开发最佳实践',
      excerpt: '了解现代前端开发的最佳实践和常见陷阱',
      category: '前端开发',
      readTime: 8,
      publishDate: '2023-05-15',
      image: '/images/placeholder.png', // 实际开发中使用真实图片
    },
    {
      id: 2,
      title: 'Node.js性能优化指南',
      excerpt: '如何优化Node.js应用性能，提高响应速度',
      category: '后端开发',
      readTime: 12,
      publishDate: '2023-06-22',
      image: '/images/placeholder.png',
    },
    {
      id: 3,
      title: 'React状态管理策略',
      excerpt: '比较不同的React状态管理库和方法',
      category: '前端开发',
      readTime: 10,
      publishDate: '2023-07-08',
      image: '/images/placeholder.png',
    },
  ];

  const paidArticles = [
    {
      id: 101,
      title: '高级系统架构设计',
      excerpt: '从零开始设计高可用、可扩展的系统架构',
      category: '系统架构',
      price: 29.9,
      publishDate: '2023-04-10',
      image: '/images/placeholder.png',
    },
    {
      id: 102,
      title: '微服务实战指南',
      excerpt: '微服务架构的实际实施步骤和经验分享',
      category: '系统架构',
      price: 39.9,
      publishDate: '2023-05-20',
      image: '/images/placeholder.png',
    },
  ];

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