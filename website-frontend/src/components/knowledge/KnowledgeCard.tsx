import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined, FilePdfOutlined, WechatOutlined, FileTextOutlined } from '@ant-design/icons';

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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  
  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
    setLiked(!liked);
    // 实际项目中，这里应该调用API将点赞状态保存到数据库
  };
  
  // 根据内容类型返回不同的图标
  const getTypeIcon = () => {
    switch(item.type) {
      case 'pdf':
        return <FilePdfOutlined className="text-red-500" />;
      case 'wechat':
        return <WechatOutlined className="text-green-500" />;
      case 'article':
      default:
        return <FileTextOutlined className="text-blue-500" />;
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* 卡片顶部图片区域 */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={item.coverImage} 
          alt={item.title} 
          fill
          className="object-cover transition duration-300 hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-full flex items-center space-x-1">
          {getTypeIcon()}
          <span className="ml-1 text-xs uppercase">
            {item.type === 'article' ? '原创' : item.type === 'wechat' ? '微信' : 'PDF'}
          </span>
        </div>
      </div>
      
      {/* 卡片内容区域 */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {item.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(item.publishDate)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary">
          <Link href={`/knowledge/${item.id}`}>
            {item.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {item.content}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              {liked ? 
                <HeartFilled className="text-primary" /> : 
                <HeartOutlined />
              }
              <span>{likeCount}</span>
            </button>
            <Link href={`/knowledge/${item.id}#comments`} className="flex items-center space-x-1 text-gray-500 hover:text-primary">
              <MessageOutlined />
              <span>{item.comments}</span>
            </Link>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-primary">
              <ShareAltOutlined />
            </button>
          </div>
          
          <Link
            href={
              item.type === 'pdf' ? (item.fileUrl || '#') :
              item.type === 'wechat' ? (item.originalLink || '#') :
              `/knowledge/${item.id}`
            }
            target={item.type === 'pdf' || item.type === 'wechat' ? '_blank' : '_self'}
            className="text-primary text-sm font-medium hover:text-primary-dark"
          >
            {
              item.type === 'pdf' ? '查看PDF' :
              item.type === 'wechat' ? '查看原文' :
              '阅读全文'
            } →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCard; 