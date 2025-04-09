"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  path: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取统计数据
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      // 从本地存储获取消息数量
      const storedMessages = localStorage.getItem('contactMessages');
      const messagesCount = storedMessages ? JSON.parse(storedMessages).length : 0;
      
      // 获取未读消息数量
      const unreadMessages = storedMessages 
        ? JSON.parse(storedMessages).filter((msg: any) => !msg.read).length 
        : 0;
      
      // 设置统计卡片数据
      setStats([
        {
          title: '总消息数',
          value: messagesCount,
          description: '收到的总联系消息数',
          icon: 'mail',
          path: '/admin/messages'
        },
        {
          title: '未读消息',
          value: unreadMessages,
          description: '待处理的新消息',
          icon: 'notification',
          path: '/admin/messages'
        },
        {
          title: '页面数',
          value: 5,
          description: '网站总页面数',
          icon: 'document',
          path: '/admin/pages'
        },
        {
          title: '社交媒体',
          value: 3,
          description: '关联的社交媒体账号',
          icon: 'share',
          path: '/admin/social'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 渲染统计卡片图标
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'notification':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'share':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 快速操作项
  const quickActions = [
    { 
      title: '查看/回复消息', 
      description: '管理收到的联系消息', 
      path: '/admin/messages',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      title: '更新页面内容', 
      description: '修改网站页面文本和图像', 
      path: '/admin/pages',
      color: 'bg-green-100 text-green-800'
    },
    { 
      title: '管理社交媒体', 
      description: '更新社交媒体链接和图标', 
      path: '/admin/social',
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      title: '更新联系信息', 
      description: '修改电话、邮箱和地址', 
      path: '/admin/contact-info',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来，管理员</h1>
        <p className="text-gray-600">
          这里是您的网站管理仪表盘，您可以在这里管理网站的所有内容。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // 加载中的占位卡片
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <Link 
              href={stat.path} 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                  {renderIcon(stat.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link 
              href={action.path}
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mr-4`}>
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">系统信息</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">系统版本</h3>
                <p className="text-sm text-gray-500">当前系统版本号</p>
              </div>
              <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                v1.0.0
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">最后登录</h3>
                <p className="text-sm text-gray-500">您上次登录的时间</p>
              </div>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString('zh-CN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">浏览器存储</h3>
                <p className="text-sm text-gray-500">所有数据存储在浏览器中</p>
              </div>
              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                LocalStorage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 