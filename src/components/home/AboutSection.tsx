"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 rounded-full bg-primary-50 opacity-70"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-secondary-50 opacity-50"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">关于我</h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">半导体/集成电路行业生产管理专家</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* 个人图片 */}
          <div className="md:col-span-5 relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 p-1">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-white">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    {/* 可以替换为真实的个人照片 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-500 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                      <span className="relative z-10">OF</span>
                    </div>
                    {/* 装饰元素 */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full -mb-16 -mr-16"></div>
                    <div className="absolute top-10 left-10 w-10 h-10 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 形状装饰 */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-100 rounded-xl -z-10 transform rotate-12"></div>
          </div>

          {/* 个人信息 */}
          <div className="md:col-span-7">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Oliver Fang</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              拥有15年半导体/集成电路行业工作经验，目前担任无锡市宜欣科技有限公司生产部长。
              从0到1建立车规级芯片测试工厂，对生产/设备/厂务/工程方面的日常管理有丰富经验。
              熟练使用AI编程工具，开发过高级计划排产系统和成本管理模块。
            </p>
            
            <div className="space-y-5 mb-8">
              <div className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">职业</div>
                  <div className="font-medium text-gray-900">生产部长 | 半导体/集成电路行业</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">教育</div>
                  <div className="font-medium text-gray-900">四川大学 人力资源管理 | 成都工业学院 机械电子工程</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 mr-4 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">位置</div>
                  <div className="font-medium text-gray-900">无锡 | 现居成都-郫都区</div>
                </div>
              </div>
            </div>

            <Link 
              href="/about" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              查看详细介绍
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 