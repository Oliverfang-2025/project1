"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 定义消息数据类型
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载消息
  useEffect(() => {
    try {
      // 客户端才能使用localStorage
      if (typeof window !== 'undefined') {
        const storedMessages = localStorage.getItem('contactMessages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      }
    } catch (err) {
      setError('加载消息时出错');
      console.error('加载消息错误:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 标记消息为已读
  const markAsRead = (id: number) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    );
    
    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  // 删除消息
  const deleteMessage = (id: number) => {
    const updatedMessages = messages.filter(msg => msg.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">消息管理</h1>
          <Link href="/" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            返回首页
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">没有消息</h2>
            <p className="text-gray-500">目前还没有收到任何联系消息。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-lg shadow-sm p-6 ${message.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{message.name}</span> &lt;{message.email}&gt;
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(message.date)}</p>
                      {!message.read && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          新消息
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!message.read && (
                      <button 
                        onClick={() => markAsRead(message.id)}
                        className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        标为已读
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMessage(message.id)}
                      className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap text-gray-700">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 