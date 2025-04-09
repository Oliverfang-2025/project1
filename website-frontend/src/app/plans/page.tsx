"use client";

import React from 'react';
import Link from 'next/link';

export default function PlansPage() {
  // 职业计划数据
  const careerPlans = [
    {
      title: "高级计划排产系统开发",
      timeline: "2024年10月 - 持续进行中",
      description: "利用AI编程工具cursor开发高级计划排产工具APS系统，解决工厂多批次多工序多机台的复杂排产需求。",
      goals: [
        "完成订单管理模块，实现订单自动分配",
        "开发资源管理模块，优化机台利用率",
        "设计产能预估模块，提供决策支持",
        "完善用户权限管理模块，确保数据安全"
      ]
    },
    {
      title: "IT化系统完善",
      timeline: "2024年 - 2025年",
      description: "进一步完善和整合企业IT系统，包括SAP/MES/ERP等系统的协同工作，提高生产效率和降低成本。",
      goals: [
        "实现SAP与MES系统的无缝对接",
        "建立完整的数据分析和可视化平台",
        "开发自动化报表和预警系统",
        "提升系统整体安全性和稳定性"
      ]
    },
    {
      title: "精益生产管理",
      timeline: "2025年 - 2026年",
      description: "引入精益生产管理模式，持续优化生产流程，降低废品率，提高生产效率。",
      goals: [
        "建立全面的精益管理体系",
        "实现年度降本增效目标",
        "优化工作流程，减少浪费",
        "提升整体生产效率和质量"
      ]
    }
  ];

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
          
          <div className="space-y-12 max-w-4xl mx-auto">
            {careerPlans.map((plan, index) => (
              <div key={index} className="card p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                  <span className="inline-block mt-2 md:mt-0 px-4 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                    {plan.timeline}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">具体目标：</h4>
                  <ul className="space-y-2">
                    {plan.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary-200"></div>
              
              <div className="space-y-12">
                {/* 已完成项目 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md md:ml-auto md:mr-0 hover-lift">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">车规级芯片测试建厂项目</h3>
                      <p className="text-gray-600 mb-2">2022年7月 - 2024年6月</p>
                      <div className="flex items-center md:justify-end text-green-600">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>已完成</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-primary-600 rounded-full md:mx-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 md:pl-8 hidden md:block"></div>
                </div>
                
                {/* 进行中项目 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 hidden md:block"></div>
                  
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-primary-600 rounded-full md:mx-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md md:mr-auto md:ml-0 hover-lift">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">高级计划排产系统开发</h3>
                      <p className="text-gray-600 mb-2">2024年10月 - 至今</p>
                      <div className="flex items-center text-blue-600">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>进行中 - 完成60%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 计划中项目 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 mb-4 md:mb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md md:ml-auto md:mr-0 hover-lift">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">IT化系统完善</h3>
                      <p className="text-gray-600 mb-2">2024年 - 2025年</p>
                      <div className="flex items-center md:justify-end text-gray-600">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>计划中</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full md:mx-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 md:pl-8 hidden md:block"></div>
                </div>
                
                {/* 计划中项目 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:text-right md:pr-8 hidden md:block"></div>
                  
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full md:mx-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md md:mr-auto md:ml-0 hover-lift">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">精益生产管理</h3>
                      <p className="text-gray-600 mb-2">2025年 - 2026年</p>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>计划中</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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