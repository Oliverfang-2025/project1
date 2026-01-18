"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPageById } from '@/lib/page-storage';

// 定义表单数据类型
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 定义消息数据类型
interface ContactMessage extends FormData {
  id: number;
  date: string;
  read: boolean;
}

// 定义联系信息类型
interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

// 定义社交媒体链接类型
interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function ContactPage() {
  const [pageData, setPageData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  } as FormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [socialLinks, setSocialLinks] = useState([] as SocialLink[]);

  // 从localStorage加载页面配置
  useEffect(() => {
    const loadPageData = () => {
      const contactPage = getPageById('contact');
      setPageData(contactPage);
      setLoading(false);
    };

    loadPageData();

    // 加载社交媒体链接
    if (typeof window !== 'undefined') {
      try {
        const storedSocial = localStorage.getItem('social_links');
        if (storedSocial) {
          setSocialLinks(JSON.parse(storedSocial));
        }
      } catch (error) {
        console.error('Failed to parse social_links:', error);
      }
    }
  }, []);

  // 监听localStorage变化（后台修改后刷新可见）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'website_pages') {
        loadPageData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 从配置中获取联系信息
  const contactInfo = pageData?.sections?.find((s: any) => s.type === 'contact')?.content || {
    phone: '13679041859',
    email: '6358000070@qq.com',
    location: '现居成都-郫都区'
  };

  const loadPageData = () => {
    const contactPage = getPageById('contact');
    setPageData(contactPage);
  };

  // 处理表单输入变化
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 保存消息到本地存储
    try {
      if (typeof window !== 'undefined') {
        const storedMessages = localStorage.getItem('contactMessages') 
          ? JSON.parse(localStorage.getItem('contactMessages') || '[]') 
          : [];
        
        const newMessage = {
          ...formData,
          id: Date.now(),
          date: new Date().toISOString(),
          read: false
        };
        
        localStorage.setItem('contactMessages', 
          JSON.stringify([newMessage, ...storedMessages]));
      }
    } catch (error) {
      console.error('保存消息失败:', error);
    }
    
    // 模拟提交延迟
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      } as FormData);
    }, 1500);
  };

  // 渲染社交媒体图标
  const renderSocialIcon = (iconType: string) => {
    switch (iconType) {
      case 'bilibili':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm-6.667 6.667c-.329 0-.605-.112-.829-.336-.223-.224-.335-.501-.335-.83s.112-.605.335-.829c.224-.224.5-.336.83-.336h5.333c.329 0 .605.112.829.336.223.224.335.5.335.83 0 .328-.112.605-.335.829-.224.224-.5.336-.83.336H9.333z" />
          </svg>
        );
      case 'wechat':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.32.32 0 0 0 .193-.066l2.378-1.63a.9.9 0 0 1 .482-.137c.085 0 .169.014.252.037 .917.235 1.876.367 2.856.367 .167 0 .334-.005.5-.015 -.638-.908-1.028-1.994-1.028-3.161 0-3.096 3.016-5.622 6.69-5.622 .186 0 .37.007.554.022C14.293 4.436 11.67 2.188 8.691 2.188zm9.4 5.784c-2.49 0-4.524 1.726-4.524 3.839 0 2.112 2.034 3.839 4.523 3.839 .602 0 1.18-.103 1.72-.284a.58.58 0 0 1 .425.053l1.673 1.15a.23.23 0 0 0 .14.048c.112 0 .205-.094.205-.208 0-.051-.021-.103-.034-.154l-.273-1.037a.555.555 0 0 1 .166-.534c1.267-.945 2.062-2.276 2.062-3.754 0-2.112-2.034-3.839-4.523-3.839Zm-11.046.66a.955.955 0 0 1 .953.956.955.955 0 0 1-.953.956.955.955 0 0 1-.953-.956c0-.528.426-.956.953-.956Zm5.336 0a.955.955 0 0 1 .953.956.955.955 0 0 1-.953.956.955.955 0 0 1-.953-.956c0-.528.426-.956.953-.956Zm4.458 2.909a.794.794 0 0 1 .793.795.794.794 0 0 1-.793.796.794.794 0 0 1-.793-.796.794.794 0 0 1 .793-.795Zm-4.229 0a.794.794 0 0 1 .793.795.794.794 0 0 1-.793.796.794.794 0 0 1-.792-.796.794.794 0 0 1 .792-.795Z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* 页面标题 */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">联系我</h1>
          <p className="text-xl max-w-3xl mx-auto">如果您有任何问题或合作意向，欢迎随时与我联系</p>
        </div>
      </section>

      {/* 联系信息和表单 */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 联系信息 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">联系方式</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">电话</h3>
                    <p className="text-gray-600">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">邮箱</h3>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">位置</h3>
                    <p className="text-gray-600">{contactInfo.location}</p>
                  </div>
                </div>
              </div>
              
              {/* 社交媒体链接 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">关注我的社交媒体</h3>
                <div className="space-y-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors animate-hover"
                    >
                      <div className="text-primary-600">
                        {renderSocialIcon(link.icon)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{link.name}</h4>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{link.url}</p>
                      </div>
                      <div className="ml-auto">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 联系表单 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">发送消息</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">消息已发送</h3>
                  <p className="text-gray-600 mb-4">感谢您的留言，我会尽快回复您！</p>
                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      发送新消息
                    </button>
                    <Link
                      href="/admin/messages"
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      查看所有消息
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">主题</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">消息</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        发送中...
                      </>
                    ) : '发送消息'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* 关注公众号 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">关注我的微信公众号</h2>
            <p className="text-lg text-gray-600 mb-8">获取最新的半导体测试领域资讯和技术分享</p>
            
            <div className="bg-white p-8 rounded-lg shadow-md inline-block">
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mb-4">
                {/* 这里放公众号二维码图片，需要替换为实际图片 */}
                <div className="text-gray-500">微信公众号二维码</div>
              </div>
              <p className="text-gray-900 font-semibold">扫描上方二维码关注</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 