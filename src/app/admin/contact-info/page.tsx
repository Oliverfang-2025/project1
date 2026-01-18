"use client";

import React, { useState, useEffect } from 'react';

// 联系信息类型
interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  wechat?: string;
  whatsapp?: string;
  skype?: string;
}

export default function ContactInfoPage() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    location: '',
    wechat: '',
    whatsapp: '',
    skype: ''
  } as ContactInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 加载联系信息
  useEffect(() => {
    setTimeout(() => {
      // 从本地存储获取联系信息，如果没有则使用默认值
      const storedInfo = localStorage.getItem('contact_info');
      
      if (storedInfo) {
        setContactInfo(JSON.parse(storedInfo));
      } else {
        // 默认联系信息
        const defaultInfo: ContactInfo = {
          phone: '13679041859',
          email: '6358000070@qq.com',
          location: '现居成都-郫都区',
          wechat: 'wechat_id_here',
          whatsapp: '',
          skype: ''
        };
        
        setContactInfo(defaultInfo);
        localStorage.setItem('contact_info', JSON.stringify(defaultInfo));
      }
      
      setLoading(false);
    }, 800);
  }, []);

  // 处理表单字段变化
  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setContactInfo((prev: ContactInfo) => ({
      ...prev,
      [name]: value
    }));
  };

  // 保存联系信息
  const handleSave = () => {
    setSaving(true);
    
    // 验证必填字段
    if (!contactInfo.phone || !contactInfo.email || !contactInfo.location) {
      alert('请填写必填字段：电话、邮箱和地址');
      setSaving(false);
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      alert('请输入有效的邮箱地址');
      setSaving(false);
      return;
    }
    
    // 保存到本地存储
    setTimeout(() => {
      localStorage.setItem('contact_info', JSON.stringify(contactInfo));
      setSaving(false);
      setShowSuccess(true);
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">联系方式管理</h1>
        {showSuccess && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            保存成功
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 主要联系信息 */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">基本联系方式</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">此电话将显示在网站上，确保是您希望公开的号码</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址/位置 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={contactInfo.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">您可以输入详细地址或大致位置，如「北京市海淀区」</p>
                </div>
              </div>
              
              {/* 社交通讯工具 */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">即时通讯工具(选填)</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    微信号
                  </label>
                  <input
                    type="text"
                    name="wechat"
                    value={contactInfo.wechat || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={contactInfo.whatsapp || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skype
                  </label>
                  <input
                    type="text"
                    name="skype"
                    value={contactInfo.skype || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </>
                ) : '保存修改'}
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              联系信息将显示在网站的联系页面和页脚区域。确保提供的信息是您希望公开的。
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">联系方式显示预览</h2>
        
        <div className="border p-4 rounded-md bg-gray-50">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">电话</h3>
                <p className="text-gray-600">{contactInfo.phone || '未设置'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">邮箱</h3>
                <p className="text-gray-600">{contactInfo.email || '未设置'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">位置</h3>
                <p className="text-gray-600">{contactInfo.location || '未设置'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 