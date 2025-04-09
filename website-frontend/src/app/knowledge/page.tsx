"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs } from 'antd';
import KnowledgeCard from '@/components/knowledge/KnowledgeCard';
import KnowledgeFilter from '@/components/knowledge/KnowledgeFilter';
import KnowledgeSorter from '@/components/knowledge/KnowledgeSorter';
import SearchBar from '@/components/common/SearchBar';

// 示例知识数据，实际开发中应从API获取
const demoKnowledgeItems = [
  {
    id: '1',
    title: '半导体测试流程详解',
    type: 'article', // article, wechat, pdf
    content: '本文详细介绍了半导体测试的全流程，包括CP测试和FT测试的区别与应用场景...',
    coverImage: '/images/knowledge-cover1.svg',
    author: 'Oliver Fang',
    publishDate: '2023-05-15',
    tags: ['半导体', '测试', '生产管理'],
    category: '技术分享',
    likes: 24,
    comments: 5,
    readTime: 8,
  },
  {
    id: '2',
    title: 'IATF16949体系认证经验分享',
    type: 'pdf',
    content: '分享我带领团队通过IATF16949体系认证的全过程经验...',
    coverImage: '/images/knowledge-cover2.svg',
    author: 'Oliver Fang',
    publishDate: '2023-06-22',
    tags: ['质量管理', 'IATF16949', '认证'],
    category: '管理经验',
    likes: 36,
    comments: 12,
    readTime: 15,
    fileUrl: '/files/IATF16949认证指南.pdf',
  },
  {
    id: '3',
    title: '半导体生产效率提升方法',
    type: 'wechat',
    content: '这是一篇来自我的微信公众号的文章，探讨了提高半导体生产效率的实用方法...',
    coverImage: '/images/knowledge-cover3.svg',
    author: 'Oliver Fang',
    publishDate: '2023-07-08',
    tags: ['生产效率', '优化', '半导体'],
    category: '技术分享',
    likes: 48,
    comments: 8,
    readTime: 10,
    originalLink: 'https://mp.weixin.qq.com/s/example-link',
  },
  {
    id: '4',
    title: '车规级芯片测试要点',
    type: 'article',
    content: '车规级芯片有着严格的测试标准和要求...',
    coverImage: '/images/knowledge-cover4.svg',
    author: 'Oliver Fang',
    publishDate: '2023-08-15',
    tags: ['芯片测试', '车规级', '质量控制'],
    category: '技术分享',
    likes: 56,
    comments: 14,
    readTime: 12,
  },
];

// 分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术分享' },
  { id: 'management', name: '管理经验' },
  { id: 'industry', name: '行业资讯' },
];

// 标签数据
const tags = [
  '半导体', '测试', '生产管理', '质量管理', 
  'IATF16949', '认证', '芯片测试', '车规级', 
  '生产效率', '优化'
];

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(demoKnowledgeItems);
  const [sortBy, setSortBy] = useState('newest'); // newest, popular, commented

  // 类型过滤选项
  const typeOptions = [
    { key: 'all', tab: '全部' },
    { key: 'article', tab: '原创文章' },
    { key: 'wechat', tab: '微信文章' },
    { key: 'pdf', tab: 'PDF文档' },
  ];

  // 过滤和排序知识项目
  useEffect(() => {
    let result = [...demoKnowledgeItems];
    
    // 按分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(item => 
        item.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    
    // 按标签过滤
    if (activeTags.length > 0) {
      result = result.filter(item => 
        activeTags.some(tag => item.tags.includes(tag))
      );
    }
    
    // 按搜索词过滤
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // 排序
    switch(sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'commented':
        result.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    
    setFilteredItems(result);
  }, [activeCategory, activeTags, searchQuery, sortBy]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleTagToggle = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">知识分享</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          分享我在半导体/集成电路行业的专业知识与实践经验，希望能够帮助到同行和对此感兴趣的朋友。
        </p>
      </div>

      {/* 顶部操作栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <SearchBar onSearch={handleSearch} placeholder="搜索知识内容..." />
        
        <div className="flex items-center space-x-4">
          <KnowledgeSorter 
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          
          <Link 
            href="/knowledge/new" 
            className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition shadow-sm font-medium"
          >
            分享新知识
          </Link>
        </div>
      </div>

      {/* 过滤器和内容区 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧过滤器 */}
        <div className="lg:w-1/4">
          <KnowledgeFilter 
            categories={categories}
            tags={tags}
            activeCategory={activeCategory}
            activeTags={activeTags}
            onCategoryChange={handleCategoryChange}
            onTagToggle={handleTagToggle}
          />
        </div>
        
        {/* 右侧内容区 */}
        <div className="lg:w-3/4">
          <Tabs defaultActiveKey="all" items={typeOptions.map(option => ({
            key: option.key,
            label: option.tab,
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems
                  .filter(item => option.key === 'all' || item.type === option.key)
                  .map(item => (
                    <KnowledgeCard 
                      key={item.id} 
                      item={item} 
                    />
                  ))
                }
              </div>
            ),
          }))} />
          
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">没有找到相关知识内容</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveTags([]);
                  setSearchQuery('');
                }}
              >
                清除所有过滤器
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 