"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 页面内容类型定义
interface PageContent {
  id: string;
  title: string;
  sections: PageSection[];
}

interface PageSection {
  id: string;
  title: string;
  type: 'hero' | 'text' | 'image' | 'cards' | 'testimonial' | 'contact';
  content: any;
}

export default function PagesManagementPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // 初始化页面数据
  useEffect(() => {
    setTimeout(() => {
      // 从本地存储获取页面数据，如果没有则使用默认数据
      const storedPages = localStorage.getItem('website_pages');
      
      if (storedPages) {
        setPages(JSON.parse(storedPages));
      } else {
        // 默认页面数据
        const defaultPages: PageContent[] = [
          {
            id: 'home',
            title: '首页',
            sections: [
              {
                id: 'hero',
                title: '主横幅',
                type: 'hero',
                content: {
                  title: '半导体/集成电路行业生产管理专家',
                  subtitle: '15年行业经验，提供专业知识与实践经验分享',
                  buttonText: '了解更多',
                  buttonLink: '/about'
                }
              },
              {
                id: 'services',
                title: '服务介绍',
                type: 'cards',
                content: {
                  title: '我能提供的服务',
                  subtitle: '多年行业经验，为您提供专业解决方案',
                  items: [
                    {
                      title: '生产管理',
                      description: '提高生产效率，优化生产流程',
                      icon: 'chart'
                    },
                    {
                      title: '测试厂建设',
                      description: '从规划到实施的全方位咨询',
                      icon: 'building'
                    },
                    {
                      title: 'IT系统规划',
                      description: '为半导体企业提供信息化解决方案',
                      icon: 'computer'
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'about',
            title: '关于我',
            sections: [
              {
                id: 'profile',
                title: '个人简介',
                type: 'text',
                content: {
                  title: '关于我',
                  text: '拥有15年半导体行业经验，专注于生产管理、测试厂建设与IT系统规划...'
                }
              },
              {
                id: 'experience',
                title: '工作经历',
                type: 'cards',
                content: {
                  title: '我的经历',
                  items: [
                    {
                      title: '高级生产经理',
                      company: 'XX半导体有限公司',
                      period: '2018-至今'
                    },
                    {
                      title: '生产主管',
                      company: 'XX科技有限公司',
                      period: '2015-2018'
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'contact',
            title: '联系我',
            sections: [
              {
                id: 'contact-info',
                title: '联系方式',
                type: 'contact',
                content: {
                  phone: '13679041859',
                  email: '6358000070@qq.com',
                  location: '现居成都-郫都区'
                }
              }
            ]
          }
        ];
        
        setPages(defaultPages);
        localStorage.setItem('website_pages', JSON.stringify(defaultPages));
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // 保存页面数据到本地存储
  const savePages = (updatedPages: PageContent[]) => {
    localStorage.setItem('website_pages', JSON.stringify(updatedPages));
    setPages(updatedPages);
  };

  // 选择页面进行编辑
  const handlePageSelect = (pageId: string) => {
    setActivePage(pageId);
    setActiveSection(null);
    setEditMode(false);
  };

  // 选择区块进行编辑
  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // 找到要编辑的区块数据
    const page = pages.find(p => p.id === activePage);
    if (page) {
      const section = page.sections.find(s => s.id === sectionId);
      if (section) {
        setFormData(section.content);
        setEditMode(true);
      }
    }
  };

  // 处理表单字段变化
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    
    // 如果是嵌套字段（如 items[0].title）
    if (name.includes('[') && name.includes(']')) {
      const [arrayName, indexStr, prop] = name.match(/([^\[\]]+)/g) || [];
      const index = parseInt(indexStr);
      
      setFormData(prev => {
        const newItems = [...prev[arrayName]];
        newItems[index] = {
          ...newItems[index],
          [prop]: value
        };
        
        return {
          ...prev,
          [arrayName]: newItems
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 保存编辑的内容
  const handleSaveSection = () => {
    const updatedPages = pages.map(page => {
      if (page.id === activePage) {
        const updatedSections = page.sections.map(section => {
          if (section.id === activeSection) {
            return {
              ...section,
              content: formData
            };
          }
          return section;
        });
        
        return {
          ...page,
          sections: updatedSections
        };
      }
      return page;
    });
    
    savePages(updatedPages);
    setEditMode(false);
    alert('保存成功！');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({});
  };

  // 渲染编辑表单
  const renderEditForm = () => {
    const page = pages.find(p => p.id === activePage);
    if (!page) return null;
    
    const section = page.sections.find(s => s.id === activeSection);
    if (!section) return null;

    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">按钮文本</label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">按钮链接</label>
              <input
                type="text"
                name="buttonLink"
                value={formData.buttonLink || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
              <textarea
                name="text"
                value={formData.text || ''}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );
        
      case 'cards':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {formData.subtitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
            
            {formData.items && formData.items.map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">卡片 {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                    <input
                      type="text"
                      name={`items[${index}].title`}
                      value={item.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {item.description !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                      <input
                        type="text"
                        name={`items[${index}].description`}
                        value={item.description || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  
                  {item.company !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                      <input
                        type="text"
                        name={`items[${index}].company`}
                        value={item.company || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  
                  {item.period !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">时间段</label>
                      <input
                        type="text"
                        name={`items[${index}].period`}
                        value={item.period || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );
        
      default:
        return <p>不支持编辑此类型的区块</p>;
    }
  };

  // 渲染页面和区块列表
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧页面列表 */}
      <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">网站页面</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {pages.map(page => (
              <li key={page.id}>
                <button
                  onClick={() => handlePageSelect(page.id)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activePage === page.id
                      ? 'bg-primary-100 text-primary-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 中间区块列表 */}
      <div className={`${editMode ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white p-4 rounded-lg shadow-sm`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activePage ? `${pages.find(p => p.id === activePage)?.title} 内容区块` : '选择一个页面'}
        </h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
            ))}
          </div>
        ) : activePage ? (
          <div className="space-y-3">
            {pages.find(p => p.id === activePage)?.sections.map(section => (
              <div
                key={section.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  activeSection === section.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSectionSelect(section.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">类型: {section.type}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            请从左侧选择一个页面进行编辑
          </div>
        )}
      </div>
      
      {/* 右侧编辑表单 */}
      {editMode && (
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              编辑: {pages.find(p => p.id === activePage)?.sections.find(s => s.id === activeSection)?.title}
            </h2>
            <div className="space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveSection}
                className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
              >
                保存
              </button>
            </div>
          </div>
          
          {renderEditForm()}
        </div>
      )}
    </div>
  );
} 