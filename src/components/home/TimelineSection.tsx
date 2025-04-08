"use client";

import React from 'react';
import Link from 'next/link';

export default function TimelineSection() {
  // 示例时间线数据，实际开发中可从API获取
  const timelineItems = [
    {
      id: 1,
      title: '参加Web技术研讨会',
      date: '2023-07-15',
      content: '分享了前端优化的经验和最佳实践，收获颇丰',
      likes: 24,
      comments: 8,
      image: '/images/placeholder.png', // 实际开发中使用真实图片
    },
    {
      id: 2,
      title: '新书推荐：《深入浅出React》',
      date: '2023-06-20',
      content: '最近读了这本书，内容深入浅出，非常推荐给前端开发者',
      likes: 32,
      comments: 12,
      image: null,
    },
    {
      id: 3,
      title: '周末登山记',
      date: '2023-05-28',
      content: '周末和朋友一起去了附近的山，拍了很多美丽的风景照片',
      likes: 45,
      comments: 15,
      image: '/images/placeholder.png',
    },
  ];

  return (
    <section id="timeline" className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">心路历程</h2>
          <p className="section-subtitle">记录生活点滴，分享成长历程</p>
        </div>

        <div className="relative">
          {/* 左侧时间线 */}
          <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="relative">
                {/* 桌面版布局 */}
                <div className="hidden md:flex items-center">
                  {/* 左右交替布局 */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 order-last'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                      <div className="mb-2 flex items-center justify-end">
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.content}</p>
                      
                      {item.image && (
                        <div className="mb-4 h-48 bg-gray-200 rounded-md relative">
                          {/* 使用占位图，实际开发时替换为真实图片 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-10 rounded-md"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-primary">图片预览</div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                          </svg>
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                          </svg>
                          <span>{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 中间圆点 */}
                  <div className="absolute left-1/2 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  {/* 空白区域 */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'order-last pl-8' : 'pr-8'}`}></div>
                </div>

                {/* 移动版布局 - 始终垂直排列 */}
                <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-2 flex items-center">
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  
                  {item.image && (
                    <div className="mb-4 h-48 bg-gray-200 rounded-md relative">
                      {/* 使用占位图，实际开发时替换为真实图片 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-10 rounded-md"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-primary">图片预览</div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                      </svg>
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/timeline" 
            className="btn"
          >
            查看完整心路历程
          </Link>
        </div>
      </div>
    </section>
  );
} 