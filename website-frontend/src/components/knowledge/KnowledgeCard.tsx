import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarOutlined, HeartOutlined, MessageOutlined, ClockCircleOutlined, FilePdfOutlined, WechatOutlined, FileTextOutlined } from '@ant-design/icons';

// 知识项目类型定义
interface KnowledgeItem {
  id: string;
  title: string;
  type: 'article' | 'wechat' | 'pdf';
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: string;
  likes: number;
  comments: number;
  readTime: number;
  fileUrl?: string;
  originalLink?: string;
}

interface KnowledgeCardProps {
  item: KnowledgeItem;
}

const KnowledgeCard = ({ item }: KnowledgeCardProps) => {
  // 根据不同类型显示不同图标
  const renderTypeIcon = () => {
    switch (item.type) {
      case 'pdf':
        return <FilePdfOutlined className="text-red-500" />;
      case 'wechat':
        return <WechatOutlined className="text-green-500" />;
      case 'article':
      default:
        return <FileTextOutlined className="text-blue-500" />;
    }
  };

  // 截断内容文本
  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      <div className="relative h-52 w-full">
        <Image
          src={item.coverImage || '/images/default-cover.svg'}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-sm font-medium shadow-sm">
          {renderTypeIcon()}
          <span>
            {item.type === 'pdf' ? 'PDF文档' : item.type === 'wechat' ? '微信文章' : '原创文章'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            item.category === '半导体' ? 'bg-blue-100 text-blue-800' :
            item.category === '生产管理' ? 'bg-green-100 text-green-800' :
            item.category === '工艺' ? 'bg-purple-100 text-purple-800' :
            item.category === '测试' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <ClockCircleOutlined className="mr-1.5" />
            <span>{item.readTime} 分钟</span>
          </div>
        </div>
        
        <Link href={`/knowledge/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2.5 text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {truncateContent(item.content, 100)}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <CalendarOutlined className="mr-1.5" />
            <span>{formatDate(item.publishDate)}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center group">
              <HeartOutlined className="mr-1.5 group-hover:text-red-500 transition-colors" />
              <span className="group-hover:text-red-500 transition-colors">{item.likes}</span>
            </div>
            <div className="flex items-center group">
              <MessageOutlined className="mr-1.5 group-hover:text-primary-500 transition-colors" />
              <span className="group-hover:text-primary-500 transition-colors">{item.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCard; 