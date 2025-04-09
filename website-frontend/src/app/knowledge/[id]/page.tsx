'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  HeartOutlined, 
  HeartFilled, 
  MessageOutlined, 
  ShareAltOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  WechatOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import CommentSection from '@/components/knowledge/CommentSection';
import { Comment } from '@/types/knowledge';

// 示例知识数据，实际开发中应从API获取
const demoKnowledgeItems = [
  {
    id: '1',
    title: '半导体测试流程详解',
    type: 'article', // article, wechat, pdf
    content: `
    <h2>半导体测试流程概述</h2>
    <p>半导体测试是芯片生产过程中至关重要的环节，主要包括两大类测试：晶圆测试（CP测试）和成品测试（FT测试）。</p>
    
    <h3>晶圆测试（CP测试）</h3>
    <p>CP测试（Chip Probing）是在晶圆未切割前，通过探针卡接触晶圆上的每个芯片进行电气性能测试，筛选出有问题的芯片，并进行墨点标记。这一过程可以在早期发现问题，避免将有缺陷的芯片进行后续封装，从而节约成本。</p>
    
    <p>CP测试通常包括：</p>
    <ul>
      <li>直流参数测试：测量芯片的电压、电流等静态参数</li>
      <li>交流参数测试：测量芯片的时序、频率响应等动态参数</li>
      <li>功能测试：验证芯片的逻辑功能是否正常</li>
    </ul>
    
    <h3>成品测试（FT测试）</h3>
    <p>FT测试（Final Test）是在芯片封装完成后进行的最终测试，这一阶段会模拟芯片在实际使用环境中的工作状态，进行全面的性能验证。</p>
    
    <p>FT测试通常包括：</p>
    <ul>
      <li>常温测试：在室温环境下进行基本功能和性能测试</li>
      <li>高温测试：在高温环境下验证芯片的稳定性</li>
      <li>低温测试：在低温环境下验证芯片的稳定性</li>
      <li>老化测试：长时间运行芯片，筛选出早期失效的产品</li>
    </ul>
    
    <h2>测试设备介绍</h2>
    <p>半导体测试需要使用专业的自动化测试设备（ATE），常见的设备包括：</p>
    
    <ul>
      <li>探针台：用于CP测试，可精确定位和控制探针卡与晶圆的接触</li>
      <li>测试机：提供测试信号和测量电路，执行测试程序</li>
      <li>分选机：根据测试结果自动分类芯片</li>
    </ul>
    
    <h2>测试程序开发</h2>
    <p>测试程序是测试过程的核心，通常由测试工程师使用专用的测试语言编写。一个完整的测试程序包括：</p>
    
    <ul>
      <li>硬件配置：定义测试引脚、电压范围等</li>
      <li>测试项目：定义各项具体的测试内容和标准</li>
      <li>测试流程：控制测试的顺序和条件分支</li>
      <li>数据处理：收集和分析测试数据</li>
    </ul>
    
    <h2>车规级芯片测试的特殊要求</h2>
    <p>对于应用在汽车领域的芯片，测试要求更为严格，主要体现在：</p>
    
    <ul>
      <li>更宽泛的温度测试范围（-40°C到125°C或更高）</li>
      <li>更严格的可靠性要求（如HTOL、LTOL等测试）</li>
      <li>零缺陷目标（通过严格的统计抽样和分析）</li>
      <li>符合AEC-Q100等车规标准</li>
    </ul>
    
    <h2>测试数据分析与良率提升</h2>
    <p>测试过程中收集的数据是提高产品良率的重要依据。通过统计分析测试数据，可以：</p>
    
    <ul>
      <li>识别常见失效模式</li>
      <li>追踪问题根源</li>
      <li>优化设计和制造工艺</li>
      <li>预测产品性能和可靠性</li>
    </ul>
    
    <p>总之，半导体测试是确保芯片质量的关键环节，通过系统化、标准化的测试流程，可以有效筛选出不合格产品，保证最终交付给客户的芯片满足性能和可靠性要求。</p>`,
    coverImage: '/images/placeholder.png',
    author: 'Oliver Fang',
    publishDate: '2023-05-15',
    tags: ['半导体', '测试', '生产管理'],
    category: '技术分享',
    likes: 24,
    comments: [
      {
        id: '101',
        author: '张工',
        avatar: '/images/avatars/user1.jpg',
        content: '文章内容非常详细，对CP和FT测试的区别解释得很清楚，感谢分享！',
        publishDate: '2023-05-16',
        likes: 5,
      },
      {
        id: '102',
        author: '李工程师',
        avatar: '/images/avatars/user2.jpg',
        content: '请问车规级芯片的温度循环测试一般需要多少个循环？',
        publishDate: '2023-05-17',
        likes: 2,
        replies: [
          {
            id: '102-1',
            author: 'Oliver Fang',
            avatar: '/images/avatars/oliver.jpg',
            content: '根据AEC-Q100规范，温度循环测试通常需要1000个循环，但具体要求可能因产品等级和客户要求有所不同。',
            publishDate: '2023-05-17',
            likes: 3,
          }
        ]
      },
    ],
    readTime: 8,
  },
  {
    id: '2',
    title: 'IATF16949体系认证经验分享',
    type: 'pdf',
    content: '这是一份详细的IATF16949体系认证经验分享文档...',
    coverImage: '/images/placeholder.png',
    author: 'Oliver Fang',
    publishDate: '2023-06-22',
    tags: ['质量管理', 'IATF16949', '认证'],
    category: '管理经验',
    likes: 36,
    comments: [],
    readTime: 15,
    fileUrl: '/files/IATF16949认证指南.pdf',
    fileSize: '2.5MB',
    filePages: 32,
  },
  {
    id: '3',
    title: '半导体生产效率提升方法',
    type: 'wechat',
    content: '这是一篇来自我的微信公众号的文章，探讨了提高半导体生产效率的实用方法...',
    coverImage: '/images/placeholder.png',
    author: 'Oliver Fang',
    publishDate: '2023-07-08',
    tags: ['生产效率', '优化', '半导体'],
    category: '技术分享',
    likes: 48,
    comments: [],
    readTime: 10,
    originalLink: 'https://mp.weixin.qq.com/s/example-link',
    wechatAccount: '半导体生产专家',
    summary: '本文从设备管理、人员培训、工艺优化和信息化系统四个方面分享了提高半导体生产效率的方法和实践案例。'
  },
];

export default function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState(null as any);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const pathname = usePathname();
  
  useEffect(() => {
    // 实际开发中应从API获取数据
    const foundArticle = demoKnowledgeItems.find(item => item.id === params.id);
    if (foundArticle) {
      setArticle(foundArticle);
      setLikeCount(foundArticle.likes);
    }
    
    // 恢复用户点赞状态（实际开发中应从服务器获取）
    const likedArticles = localStorage.getItem('likedArticles');
    if (likedArticles) {
      const parsed = JSON.parse(likedArticles) as string[];
      if (parsed.includes(params.id)) {
        setLiked(true);
      }
    }
  }, [params.id]);
  
  const handleLike = () => {
    // 更新点赞状态和计数
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    // 保存点赞状态（实际开发中应调用API）
    const likedArticlesStr = localStorage.getItem('likedArticles') || '[]';
    const likedArticles = JSON.parse(likedArticlesStr) as string[];
    
    if (newLiked) {
      if (!likedArticles.includes(params.id)) {
        likedArticles.push(params.id);
      }
    } else {
      const index = likedArticles.indexOf(params.id);
      if (index > -1) {
        likedArticles.splice(index, 1);
      }
    }
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <p className="text-xl text-gray-600">正在加载内容...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 返回链接 */}
      <div className="mb-8">
        <Link href="/knowledge" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeftOutlined className="mr-2" />
          返回知识列表
        </Link>
      </div>
      
      {/* 文章头部信息 */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {article.category}
          </span>
          {article.type === 'article' && (
            <span className="flex items-center text-blue-500 px-3 py-1 bg-blue-50 rounded-full text-sm">
              <FileTextOutlined className="mr-1" /> 原创文章
            </span>
          )}
          {article.type === 'pdf' && (
            <span className="flex items-center text-red-500 px-3 py-1 bg-red-50 rounded-full text-sm">
              <FilePdfOutlined className="mr-1" /> PDF文档
            </span>
          )}
          {article.type === 'wechat' && (
            <span className="flex items-center text-green-500 px-3 py-1 bg-green-50 rounded-full text-sm">
              <WechatOutlined className="mr-1" /> 微信文章
            </span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <div className="flex items-center mr-6">
            <UserOutlined className="mr-2" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center mr-6">
            <ClockCircleOutlined className="mr-2" />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2" />
            <span>阅读时间 {article.readTime} 分钟</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <TagOutlined className="text-gray-500 mt-1" />
          {article.tags.map((tag: string) => (
            <Link 
              key={tag} 
              href={`/knowledge?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 文章封面图 */}
      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
        <Image 
          src={article.coverImage} 
          alt={article.title} 
          fill
          className="object-cover"
        />
      </div>
      
      {/* 文章内容区域 - 根据类型不同展示不同内容 */}
      {article.type === 'article' && (
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}
      
      {article.type === 'pdf' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12 text-center">
          <FilePdfOutlined className="text-5xl text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">PDF文档</h3>
          <p className="text-gray-600 mb-2">文件大小: {article.fileSize} | 页数: {article.filePages}页</p>
          <p className="text-gray-600 mb-6">{article.content}</p>
          <a 
            href={article.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition inline-flex items-center"
          >
            <FilePdfOutlined className="mr-2" />
            查看PDF文档
          </a>
        </div>
      )}
      
      {article.type === 'wechat' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <WechatOutlined className="text-3xl text-green-500 mr-4" />
            <div>
              <h3 className="text-xl font-bold">微信公众号文章</h3>
              <p className="text-gray-600">来源: {article.wechatAccount}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-md border border-gray-200 mb-6">
            <h4 className="text-lg font-bold mb-4">文章摘要</h4>
            <p className="text-gray-700">{article.summary}</p>
          </div>
          
          <div className="text-center">
            <a 
              href={article.originalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-success bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition inline-flex items-center"
            >
              <WechatOutlined className="mr-2" />
              在微信中查看原文
            </a>
          </div>
        </div>
      )}
      
      {/* 互动区域 */}
      <div className="flex justify-between items-center border-t border-b border-gray-200 py-6 mb-8">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-2 text-lg hover:text-primary transition"
          >
            {liked ? (
              <HeartFilled className="text-primary text-xl" />
            ) : (
              <HeartOutlined className="text-xl" />
            )}
            <span>{likeCount}</span>
          </button>
          
          <a href="#comments" className="flex items-center space-x-2 text-lg hover:text-primary transition">
            <MessageOutlined className="text-xl" />
            <span>{article.comments ? article.comments.length : 0}</span>
          </a>
          
          <button className="flex items-center space-x-2 text-lg hover:text-primary transition">
            <ShareAltOutlined className="text-xl" />
            <span>分享</span>
          </button>
        </div>
        
        <div className="hidden md:block">
          <Link 
            href={`/knowledge`}
            className="text-primary hover:text-primary-dark font-medium"
          >
            查看更多知识内容
          </Link>
        </div>
      </div>
      
      {/* 评论区 */}
      <div id="comments" className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">评论区</h3>
        <CommentSection 
          comments={article.comments || []} 
          articleId={article.id}
        />
      </div>
      
      {/* 相关文章推荐 */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoKnowledgeItems
            .filter(item => item.id !== article.id)
            .filter(item => 
              item.tags.some(tag => article.tags.includes(tag)) || 
              item.category === article.category
            )
            .slice(0, 3)
            .map(item => (
              <Link key={item.id} href={`/knowledge/${item.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-40">
                    <Image 
                      src={item.coverImage} 
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatDate(item.publishDate)}</span>
                      <span className="flex items-center">
                        <HeartOutlined className="mr-1" />
                        {item.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
} 