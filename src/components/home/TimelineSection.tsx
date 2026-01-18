"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TimelineItem } from '@/types/timeline';
import { getTimelineItems } from '@/lib/timeline-storage';

export default function TimelineSection() {
  const [timelineItems, setTimelineItems] = useState([] as TimelineItem[]);
  const [loading, setLoading] = useState(true);

  // Load timeline items from localStorage
  useEffect(() => {
    const items = getTimelineItems();
    // Show only the first 3 items on the homepage
    setTimelineItems(items.slice(0, 3));
    setLoading(false);
  }, []);

  return (
    <section id="timeline" className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">心路历程</h2>
          <p className="section-subtitle">记录生活点滴，分享成长历程</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : timelineItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">暂无时间线内容</p>
          </div>
        ) : (
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
                      <div className="bg-white p-6 rounded-lg shadow-md hover-glow transition">
                        <div className="mb-2 flex items-center justify-end">
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.content}</p>

                        {item.category && (
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-end text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                            </svg>
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center ml-4">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                            </svg>
                            <span>{item.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 中间圆点 */}
                    <div className="absolute left-1/2 w-8 h-8 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(0,102,204,0.6)]">
                      <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
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

                    {item.category && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
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
        )}

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
