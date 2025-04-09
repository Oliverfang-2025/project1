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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="relative h-48 w-full">
        <Image
          src={item.coverImage || '/images/default-cover.jpg'}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md flex items-center space-x-1 text-sm font-medium">
          {renderTypeIcon()}
          <span>
            {item.type === 'pdf' ? 'PDF文档' : item.type === 'wechat' ? '微信文章' : '原创文章'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
            {item.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <ClockCircleOutlined className="mr-1" />
            <span>{item.readTime} 分钟</span>
          </div>
        </div>
        
        <Link href={`/knowledge/${item.id}`}>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 text-sm">
          {truncateContent(item.content)}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <CalendarOutlined className="mr-1" />
            <span>{formatDate(item.publishDate)}</span>
          </div>
          
          <div className="flex space-x-3">
            <div className="flex items-center">
              <HeartOutlined className="mr-1" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageOutlined className="mr-1" />
              <span>{item.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCard; 