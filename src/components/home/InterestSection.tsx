"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Interest } from '@/types/interest';
import { getInterests } from '@/lib/interest-storage';

export default function InterestSection() {
  const [interests, setInterests] = useState([] as Interest[]);
  const [loading, setLoading] = useState(true);

  // Load interests from localStorage on mount
  useEffect(() => {
    const loadInterests = () => {
      const data = getInterests();
      setInterests(data);
      setLoading(false);
    };

    loadInterests();
  }, []);

  return (
    <section id="interests" className="py-12 bg-gradient-to-b from-white to-neutral">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">兴趣爱好</h2>
          <p className="section-subtitle">生活不只有工作，还有丰富多彩的兴趣</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center text-gray-500 py-8">
              加载中...
            </div>
          ) : interests.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-8">
              暂无兴趣爱好数据
            </div>
          ) : (
            interests.map((interest) => (
              <div key={interest.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* 图标/图片部分 */}
                <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {interest.icon ? (
                      <span className="text-6xl">{interest.icon}</span>
                    ) : (
                      <span className="text-primary font-bold text-xl">{interest.name}</span>
                    )}
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
            ))
          )}
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