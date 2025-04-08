"use client";

import React, { useState, useEffect } from 'react';

// 社交媒体链接类型
interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function SocialMediaPage() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({
    id: '',
    name: '',
    url: '',
    icon: 'default'
  });

  // 加载社交媒体链接
  useEffect(() => {
    setTimeout(() => {
      // 从本地存储获取社交链接，如果没有则使用默认数据
      const storedLinks = localStorage.getItem('social_links');
      
      if (storedLinks) {
        setSocialLinks(JSON.parse(storedLinks));
      } else {
        // 默认社交媒体链接
        const defaultLinks: SocialLink[] = [
          {
            id: 'bilibili',
            name: 'B站',
            url: 'https://space.bilibili.com/209748514',
            icon: 'bilibili'
          },
          {
            id: 'wechat',
            name: '微信公众号',
            url: 'https://mp.weixin.qq.com/s/eqi0peIX25QuMYaN1uI6qA',
            icon: 'wechat'
          },
          {
            id: 'linkedin',
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/邈霖-oliver-方（fang）-396908105',
            icon: 'linkedin'
          }
        ];
        
        setSocialLinks(defaultLinks);
        localStorage.setItem('social_links', JSON.stringify(defaultLinks));
      }
      
      setLoading(false);
    }, 800);
  }, []);

  // 保存社交链接到本地存储
  const saveSocialLinks = (links: SocialLink[]) => {
    localStorage.setItem('social_links', JSON.stringify(links));
    setSocialLinks(links);
  };

  // 处理表单字段变化
  const handleInputChange = (e: any, isNewLink: boolean = false) => {
    const { name, value } = e.target;
    
    if (isNewLink) {
      setNewLink(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (editingLink) {
      setEditingLink(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  // 开始编辑链接
  const startEditing = (link: SocialLink) => {
    setEditingLink(link);
    setIsAdding(false);
  };

  // 取消编辑
  const cancelEditing = () => {
    setEditingLink(null);
    setIsAdding(false);
  };

  // 保存编辑的链接
  const saveEditedLink = () => {
    if (!editingLink) return;
    
    const updatedLinks = socialLinks.map(link => 
      link.id === editingLink.id ? editingLink : link
    );
    
    saveSocialLinks(updatedLinks);
    setEditingLink(null);
  };

  // 开始添加新链接
  const startAddingLink = () => {
    setIsAdding(true);
    setEditingLink(null);
    setNewLink({
      id: `social_${Date.now()}`,
      name: '',
      url: '',
      icon: 'default'
    });
  };

  // 保存新链接
  const saveNewLink = () => {
    if (!newLink.name || !newLink.url) {
      alert('请填写完整的社交媒体信息');
      return;
    }
    
    const updatedLinks = [...socialLinks, newLink];
    saveSocialLinks(updatedLinks);
    setIsAdding(false);
    setNewLink({
      id: '',
      name: '',
      url: '',
      icon: 'default'
    });
  };

  // 删除链接
  const deleteLink = (id: string) => {
    if (window.confirm('确定要删除这个社交媒体链接吗？')) {
      const updatedLinks = socialLinks.filter(link => link.id !== id);
      saveSocialLinks(updatedLinks);
    }
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
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'default':
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  // 社交媒体图标选项
  const iconOptions = [
    { value: 'bilibili', label: 'B站' },
    { value: 'wechat', label: '微信' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'default', label: '默认链接' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">社交媒体管理</h1>
        <button
          onClick={startAddingLink}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          disabled={isAdding || editingLink !== null}
        >
          添加社交媒体
        </button>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 社交媒体列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinks.map(link => (
              <div key={link.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-primary-600 flex-shrink-0">
                      {renderSocialIcon(link.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{link.name}</h3>
                      <p className="text-sm text-gray-600 break-all mt-1">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(link)}
                      className="text-gray-500 hover:text-primary-600"
                      disabled={editingLink !== null || isAdding}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-gray-500 hover:text-red-600"
                      disabled={editingLink !== null || isAdding}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 编辑表单 */}
          {editingLink && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">编辑社交媒体</h2>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                  <input
                    type="text"
                    name="name"
                    value={editingLink.name}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={editingLink.url}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <select
                    name="icon"
                    value={editingLink.icon}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveEditedLink}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    保存修改
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 添加表单 */}
          {isAdding && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">添加社交媒体</h2>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                  <input
                    type="text"
                    name="name"
                    value={newLink.name}
                    onChange={e => handleInputChange(e, true)}
                    placeholder="例如: Twitter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={newLink.url}
                    onChange={e => handleInputChange(e, true)}
                    placeholder="例如: https://twitter.com/yourusername"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <select
                    name="icon"
                    value={newLink.icon}
                    onChange={e => handleInputChange(e, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={saveNewLink}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 