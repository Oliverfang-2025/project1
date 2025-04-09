"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TeamSection() {
  // 团队成员数据
  const teamMembers = [
    {
      name: "Oliver Fang",
      position: "生产部门负责人",
      avatar: "/images/avatars/oliver.svg",
      skills: ["生产管理", "测试优化", "团队协作"]
    },
    {
      name: "张工",
      position: "生产主管",
      avatar: "/images/avatars/professional.svg",
      skills: ["设备维护", "工艺优化", "质量管控"]
    },
    {
      name: "王工",
      position: "设备工程师",
      avatar: "/images/avatars/user3.svg",
      skills: ["设备调试", "自动化", "故障分析"]
    },
    {
      name: "李工",
      position: "测试工程师",
      avatar: "/images/avatars/user2.svg",
      skills: ["测试程序", "数据分析", "良率提升"]
    },
    {
      name: "赵工",
      position: "质量工程师",
      avatar: "/images/avatars/user1.svg",
      skills: ["质量控制", "SPC分析", "可靠性测试"]
    },
    {
      name: "林工",
      position: "IT支持",
      avatar: "/images/avatars/female.svg",
      skills: ["系统维护", "数据库", "网络安全"]
    }
  ];

  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">我们的团队</h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            一支专业、高效的半导体测试团队，共同努力创造卓越的测试解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary-100">
                    <Image 
                      src={member.avatar} 
                      alt={member.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-primary-600">{member.position}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">专业技能：</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg">
            <Image 
              src="/images/team.svg" 
              alt="团队合影" 
              width={400}
              height={300}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 w-full text-white">
                <p className="font-medium text-lg">团队合影</p>
                <p className="text-sm opacity-90">共同探索半导体测试的未来</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 