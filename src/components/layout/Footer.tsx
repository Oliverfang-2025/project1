"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([] as SocialLink[]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLinks = localStorage.getItem('social_links');
      if (storedLinks) {
        try {
          setSocialLinks(JSON.parse(storedLinks));
        } catch (error) {
          console.error('Failed to parse social_links:', error);
        }
      }
    }
  }, []);
  return (
    <footer className="bg-gray-900 text-white overflow-hidden relative">
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary-500 opacity-5 rounded-full translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container py-20 relative z-10">
        {/* 页脚顶部 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-800 pb-12">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">OF2088</h2>
            <p className="text-gray-400 max-w-md">半导体/集成电路行业生产管理专家，分享专业知识与职业经验，记录个人成长，并提供社交互动功能。</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">关于我</Link>
            <Link href="/knowledge" className="text-gray-400 hover:text-white transition-colors">知识库</Link>
            <Link href="/timeline" className="text-gray-400 hover:text-white transition-colors">历程</Link>
            <Link href="/contact" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors">联系我</Link>
          </div>
        </div>
        
        {/* 页脚内容 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* 关于部分 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block">关于</h3>
            <p className="text-gray-400 mb-4">
              分享技术知识和个人经验，记录成长历程，展示个人项目和作品。
            </p>
            
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-primary-600 transition-colors"
                  title={link.name}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {link.icon === 'bilibili' && (
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773h-2.46a.589.589 0 0 1-.587-.587c0-.32.267-.587.587-.587h2.46c1.067.024 1.964.351 2.693.98.73.629 1.102 1.52 1.12 2.675v7.52c-.018 1.155-.39 2.047-1.12 2.675-.729.63-1.626.957-2.693.981H5.333c-1.067-.024-1.964-.351-2.693-.98-.73-.628-1.102-1.52-1.12-2.676v-7.52c.018-1.155.39-2.047 1.12-2.676.729-.629 1.626-.956 2.693-.98h2.46c.32 0 .587.267.587.587 0 .32-.267.587-.587.587h-2.46zm7.56 3.413c.32 0 .587.267.587.587v3.84c0 .32-.267.587-.587.587h-.587a.589.589 0 0 1-.587-.587v-3.84c0-.32.267-.587.587-.587h.587zm3.413 0c.32 0 .587.267.587.587v3.84c0 .32-.267.587-.587.587h-.587a.589.589 0 0 1-.587-.587v-3.84c0-.32.267-.587.587-.587h.587z"/>
                    )}
                    {link.icon === 'wechat' && (
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .186-.059l2.257-1.34a.588.588 0 0 1 .45-.05 9.522 9.522 0 0 0 2.73.402c.175 0 .328-.026.5-.026-.207-.618-.328-1.266-.328-1.929 0-3.783 3.612-6.864 8.084-6.864.264 0 .514.025.764.05-.449-3.563-4.04-6.729-8.269-6.729zm-5.194 9.51a.98.98 0 0 1-.972-.982.98.98 0 0 1 .972-.982.98.98 0 0 1 .971.982.98.98 0 0 1-.971.981zm2.99 0a.98.98 0 0 1-.972-.982.98.98 0 0 1 .971-.982.98.98 0 0 1 .972.982.98.98 0 0 1-.972.981zm12.698 3.89c3.697 0 6.805 2.76 6.805 6.137 0 1.844-.99 3.499-2.533 4.637a.495.495 0 0 0-.186.554l.342 1.23c.018.059.04.118.04.177 0 .136-.109.246-.245.246a.27.27 0 0 1-.156-.05l-1.885-1.116a.49.49 0 0 0-.371-.04 7.98 7.98 0 0 1-1.811.209c-3.697 0-6.806-2.76-6.806-6.136 0-3.378 3.109-6.137 6.806-6.137zm-4.285 6.137a.818.818 0 0 0 .812-.818.818.818 0 0 0-.812-.817.818.818 0 0 0-.813.817.818.818 0 0 0 .813.818zm2.537 0a.818.818 0 0 0 .813-.818.818.818 0 0 0-.813-.817.818.818 0 0 0-.812.817.818.818 0 0 0 .812.818z"/>
                    )}
                    {link.icon === 'linkedin' && (
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    )}
                    {link.icon === 'twitter' && (
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    )}
                    {link.icon === 'youtube' && (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    )}
                    {(link.icon === 'default' || !['bilibili', 'wechat', 'linkedin', 'twitter', 'youtube'].includes(link.icon)) && (
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block">快速链接</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  关于我
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  知识库
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  心路历程
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block">联系方式</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span>635800070@qq.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span>+86 136 7904 1859</span>
              </li>
              <li className="flex items-center text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>无锡 | 成都-郫都区</span>
              </li>
            </ul>
          </div>

          {/* 订阅 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800 inline-block">订阅更新</h3>
            <p className="text-gray-400 mb-4">
              订阅我的通讯，获取最新内容更新
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="您的邮箱地址"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 border-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500">我尊重您的隐私，不会向第三方分享您的信息。</p>
            </form>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} OF2088.top 版权所有</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-sm">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-sm">
              使用条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 