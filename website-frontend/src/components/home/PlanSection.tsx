"use client";

import React from 'react';
import Link from 'next/link';

export default function PlanSection() {
  // 示例计划数据，实际开发中可从API获取
  const plans = [
    {
      id: 1,
      title: '技术提升计划',
      description: '学习最新的前端框架和技术，每月至少完成一个技术项目',
      progress: 75,
      category: '职业发展',
    },
    {
      id: 2,
      title: '读书计划',
      description: '每月阅读3本书，包括技术、管理和文学类书籍',
      progress: 60,
      category: '个人成长',
    },
    {
      id: 3,
      title: '健身计划',
      description: '每周至少锻炼3次，包括有氧运动和力量训练',
      progress: 50,
      category: '健康',
    },
  ];

  return (
    <section id="plans" className="py-12 bg-neutral">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">我的计划</h2>
          <p className="section-subtitle">记录我的目标和进展，保持前进的动力</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="card transition-transform hover:-translate-y-1">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                  {plan.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">完成进度</span>
                  <span className="font-medium">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <Link 
                href={`/plans/${plan.id}`}
                className="text-primary font-medium hover:text-primary-dark"
              >
                查看详情 →
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link 
            href="/plans" 
            className="btn"
          >
            查看所有计划
          </Link>
        </div>
      </div>
    </section>
  );
} 