"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plan } from '@/types/plan';
import { getPlans } from '@/lib/plan-storage';

export default function PlansPage() {
  const [plans, setPlans] = useState([] as Plan[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPlans = getPlans();
    setPlans(storedPlans);
    setLoading(false);
  }, []);

  // 个人发展目标
  const personalGoals = [
    {
      title: "学习拓展",
      icon: "📚",
      description: "持续学习先进的生产管理理论和技术，特别是智能制造和工业4.0相关知识。"
    },
    {
      title: "技能提升",
      icon: "🚀",
      description: "继续提升AI编程能力，掌握更多数据分析和可视化技术，增强解决复杂问题的能力。"
    },
    {
      title: "团队建设",
      icon: "👥",
      description: "培养高效协作的团队，建立健全的培训和考核体系，提高团队整体能力。"
    },
    {
      title: "行业影响",
      icon: "🌟",
      description: "通过技术创新和管理创新，在半导体测试领域产生积极影响，获得行业认可。"
    }
  ];

  return (
    <div className="pt-24">
      {/* 页面标题 */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">我的职业计划</h1>
          <p className="text-xl max-w-3xl mx-auto">记录发展目标和进步历程，保持前进的动力</p>
        </div>
      </section>

      {/* 职业计划 */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">职业发展计划</h2>

          {loading ? (
            <div className="space-y-12 max-w-4xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-8 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="space-y-12 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div key={plan.id} className="card p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                          {plan.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* 进度条 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-800">完成进度</span>
                      <span className="font-semibold text-primary-600">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>暂无计划数据</p>
            </div>
          )}
        </div>
      </section>

      {/* 个人发展目标 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">个人发展目标</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {personalGoals.map((goal, index) => (
              <div key={index} className="card p-8 hover-lift">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{goal.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                </div>
                <p className="text-gray-600">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 进度跟踪 */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">计划进度跟踪</h2>

          {loading ? (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : plans.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

                <div className="space-y-12">
                  {plans.map((plan, index) => {
                    const isLeft = index % 2 === 0;
                    const statusColor = plan.progress === 100 ? 'bg-green-600' : plan.progress > 0 ? 'bg-primary-600' : 'bg-gray-400';

                    return (
                      <div key={plan.id} className="relative flex flex-col md:flex-row items-center">
                        {isLeft ? (
                          <>
                            <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                              <div className="bg-white p-6 rounded-lg shadow-md md:ml-auto md:mr-0 hover-lift">
                                <div className="mb-2">
                                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                                    {plan.category}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                                <p className="text-gray-600 mb-2">{plan.description}</p>
                                <div className={`flex items-center md:justify-end ${plan.progress === 100 ? 'text-green-600' : plan.progress > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {plan.progress === 100 ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                  </svg>
                                  <span>{plan.progress === 100 ? '已完成' : plan.progress > 0 ? `进行中 - ${plan.progress}%` : '计划中'}</span>
                                </div>
                              </div>
                            </div>

                            <div className={`z-10 flex items-center justify-center w-8 h-8 ${statusColor} rounded-full md:mx-0`}>
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={plan.progress === 100 ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                              </svg>
                            </div>

                            <div className="flex-1 md:pl-8 hidden md:block"></div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 md:text-right md:pr-8 hidden md:block"></div>

                            <div className={`z-10 flex items-center justify-center w-8 h-8 ${statusColor} rounded-full md:mx-0`}>
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={plan.progress === 100 ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                              </svg>
                            </div>

                            <div className="flex-1 md:pl-8 mb-4 md:mb-0">
                              <div className="bg-white p-6 rounded-lg shadow-md md:mr-auto md:ml-0 hover-lift">
                                <div className="mb-2">
                                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary bg-opacity-10 text-primary">
                                    {plan.category}
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                                <p className="text-gray-600 mb-2">{plan.description}</p>
                                <div className={`flex items-center ${plan.progress === 100 ? 'text-green-600' : plan.progress > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {plan.progress === 100 ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                  </svg>
                                  <span>{plan.progress === 100 ? '已完成' : plan.progress > 0 ? `进行中 - ${plan.progress}%` : '计划中'}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>暂无计划数据</p>
            </div>
          )}
        </div>
      </section>
      
      {/* 反馈与调整 */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">计划是动态的</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">职业发展计划将根据行业变化和个人成长不断调整，欢迎提供反馈和建议！</p>
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-white text-primary-600 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            提供反馈
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
} 