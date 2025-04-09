"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  // 专业技能数据
  const skills = [
    { name: "半导体生产管理", level: 95 },
    { name: "测试厂建设规划", level: 90 },
    { name: "IATF16949体系", level: 85 },
    { name: "AI编程", level: 80 },
    { name: "IT系统规划与管理", level: 85 },
    { name: "Office软件应用", level: 95 },
  ];

  // 工作经历数据
  const workExperience = [
    {
      company: "无锡市宜欣科技有限公司",
      position: "生产部长",
      period: "2022年7月 - 至今",
      description: "主导车间建厂过程管理，设备选型和管理，体系建设，IT化系统建设，生产管理与运营，以及团队建设。成功建立车规级芯片FT测试和CP测试能力，通过IATF16949认证，实现月产值300万+。"
    },
    {
      company: "成都芯源系统有限公司",
      position: "生产技术培训体系负责人",
      period: "2010年7月 - 2022年7月",
      description: "12年生产运营管理经验，历任产线技术员、STR技术工程师、制造部培训负责人，积累1000+小时培训经历，负责生产运营部所有一线岗位的培训和考核体系课程开发执行。"
    }
  ];

  // 教育背景数据
  const education = [
    {
      school: "四川大学",
      degree: "本科",
      major: "人力资源管理（工商管理类）",
      period: "2018年9月 - 2020年6月"
    },
    {
      school: "成都工业学院",
      degree: "大专",
      major: "机械电子工程",
      period: "2007年9月 - 2010年6月"
    }
  ];

  return (
    <div className="pt-24">
      {/* 顶部个人介绍 */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-4 text-center">
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                  <span className="text-6xl font-bold">OF</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Oliver Fang</h1>
              <p className="text-xl font-light mb-8">生产部长 | 半导体/集成电路专家</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>男 | 36岁（1988/10）| 15年工作经验</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>13679041859</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>6358000070@qq.com</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>现居成都-郫都区</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 个人优势 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">个人优势</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8 hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">AI编程能力</h3>
              </div>
              <p className="text-gray-600">熟练使用AI编程类Cursor，可开发web应用程序，已成功开发自动排产模块，成本模块</p>
            </div>
            
            <div className="card p-8 hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">测试厂建厂经验</h3>
              </div>
              <p className="text-gray-600">拥有从0到1的测试厂建厂经验，对生产/设备/厂务/工程方面的日常管理，运行制度建立，岗位技能矩阵和工作负荷等管理方案拥有丰富的规划和执行落地经验</p>
            </div>
            
            <div className="card p-8 hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">外企生产运营管理</h3>
              </div>
              <p className="text-gray-600">拥有从1到1000+的外企生产运营管理相关经验。对生产运营管理紧密相关部门理解深刻，主导和协同作战能力强</p>
            </div>
            
            <div className="card p-8 hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">IT系统与质量体系</h3>
              </div>
              <p className="text-gray-600">对SAP/ERP/MES/RTM/EAP等软件系统及硬件防控方面的错漏混防控设计，有一整套完整的经过实践验证过的规划设计方案</p>
            </div>
          </div>
        </div>
      </section>

      {/* 专业技能 */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">专业技能</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工作经历 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">工作经历</h2>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {workExperience.map((exp, index) => (
              <div key={index} className="card p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{exp.company}</h3>
                  <span className="text-primary-600 font-medium">{exp.period}</span>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-4">{exp.position}</p>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 教育背景 */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">教育背景</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <div key={index} className="card p-8 hover-lift">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{edu.school}</h3>
                  <span className="text-primary-600 font-medium">{edu.period}</span>
                </div>
                <p className="text-gray-700 mb-1">{edu.degree}</p>
                <p className="text-gray-600">{edu.major}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 联系我 */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">对我的经历感兴趣?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">如果您对我的经历和技能感兴趣，或者想了解更多关于半导体测试领域的信息，欢迎随时联系我！</p>
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-white text-primary-600 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            联系我
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
} 