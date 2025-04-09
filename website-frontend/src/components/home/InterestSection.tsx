"use client";

import React from 'react';
import Link from 'next/link';

export default function InterestSection() {
  // 示例兴趣爱好数据，实际开发中可从API获取
  const interests = [
    {
      id: 1,
      name: '摄影',
      description: '捕捉生活中美好的瞬间，记录旅行见闻',
      imageUrl: '/images/placeholder.png', // 实际开发中使用真实图片
      category: '艺术',
    },
    {
      id: 2,
      name: '阅读',
      description: '探索书籍中的知识和故事，扩展视野',
      imageUrl: '/images/placeholder.png',
      category: '文化',
    },
    {
      id: 3,
      name: '烹饪',
      description: '尝试各种美食制作，享受烹饪的乐趣',
      imageUrl: '/images/placeholder.png',
      category: '生活',
    },
    {
      id: 4,
      name: '旅行',
      description: '探索世界各地的风景和文化',
      imageUrl: '/images/placeholder.png',
      category: '探索',
    },
  ];

  return (
    <section id="interests" className="py-12 bg-gradient-to-b from-white to-neutral">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">兴趣爱好</h2>
          <p className="section-subtitle">生活不只有工作，还有丰富多彩的兴趣</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interests.map((interest) => (
            <div key={interest.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* 图片部分 */}
              <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                {/* 使用占位图，实际开发时替换为真实图片 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">{interest.name}</span>
                </div>
              </div>
              
              {/* 内容部分 */}
              <div className="p-6 md:w-2/3">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                    {interest.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{interest.name}</h3>
                <p className="text-gray-600 mb-4">{interest.description}</p>
                
                <Link 
                  href={`/interests/${interest.id}`}
                  className="text-primary font-medium hover:text-primary-dark"
                >
                  查看详情 →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/interests" 
            className="btn"
          >
            查看所有兴趣爱好
          </Link>
        </div>
      </div>
    </section>
  );
} 