"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PaidArticlePage() {
  const params = useParams();
  const articleId = params.id;

  // Sample article data - in production, fetch from API
  const articleData: Record<string, any> = {
    '101': {
      id: 101,
      title: '高级系统架构设计',
      category: '系统架构',
      price: 29.9,
      publishDate: '2023-04-10',
      description: '从零开始设计高可用、可扩展的系统架构',
      features: ['高可用性设计', '微服务架构', '性能优化', '监控告警'],
      chapters: [
        { title: '第一章：架构设计基础', duration: '45分钟', free: true },
        { title: '第二章：高可用性设计', duration: '60分钟', free: false },
        { title: '第三章：微服务架构', duration: '75分钟', free: false },
        { title: '第四章：性能优化策略', duration: '50分钟', free: false },
        { title: '第五章：监控与告警', duration: '40分钟', free: false },
      ]
    },
    '102': {
      id: 102,
      title: '微服务实战指南',
      category: '系统架构',
      price: 39.9,
      publishDate: '2023-05-20',
      description: '微服务架构的实际实施步骤和经验分享',
      features: ['服务拆分', 'API 网关', '服务发现', '容器化部署'],
      chapters: [
        { title: '第一章：微服务概述', duration: '30分钟', free: true },
        { title: '第二章：服务拆分策略', duration: '55分钟', free: false },
        { title: '第三章：API 网关设计', duration: '65分钟', free: false },
        { title: '第四章：服务发现与注册', duration: '50分钟', free: false },
        { title: '第五章：容器化与编排', duration: '70分钟', free: false },
        { title: '第六章：分布式追踪', duration: '45分钟', free: false },
      ]
    }
  };

  const article = articleData[articleId as string] || articleData['101'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
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
              <Link href="/knowledge/paid" className="text-gray-500 hover:text-gray-900">
                付费专栏
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm text-white/80">{article.publishDate}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{article.title}</h1>
                <p className="text-white/90 text-lg">{article.description}</p>
              </div>

              <div className="p-8">
                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">专栏特色：</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {article.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapters */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">课程大纲：</h3>
                  <div className="space-y-3">
                    {article.chapters.map((chapter: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          chapter.free
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center flex-1">
                          {chapter.free ? (
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-4 5H5v-6l4-5 6 6zm-3.75-4.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          <span className="font-medium text-gray-900">{chapter.title}</span>
                        </div>
                        <div className="text-sm text-gray-500 ml-4">
                          {chapter.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  OF
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Oliver Fang</h3>
                  <p className="text-gray-600 text-sm mb-2">半导体/集成电路行业生产管理专家</p>
                  <p className="text-gray-500 text-sm">
                    拥有15年行业经验，专注于生产管理、测试厂建设与IT系统规划，熟练使用AI编程工具进行系统开发。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">¥{article.price}</div>
                <p className="text-gray-500 text-sm">一次性购买，永久访问</p>
              </div>

              <button className="w-full btn bg-primary-600 text-white py-3 rounded-lg mb-4 hover:bg-primary-700 transition">
                立即购买
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  永久访问权限
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  内容持续更新
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  赠送学习资源
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  如有疑问，请通过邮箱联系：
                  <br />
                  <a href="mailto:635800070@qq.com" className="text-primary-600">
                    635800070@qq.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/knowledge/paid"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回专栏列表
          </Link>
        </div>
      </div>
    </div>
  );
}
