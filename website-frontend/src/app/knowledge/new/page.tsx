'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FileTextOutlined, 
  FilePdfOutlined, 
  WechatOutlined, 
  PictureOutlined,
  TagOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

// 富文本编辑器组件（实际项目应使用真实组件如TinyMCE或Quill）
const RichTextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 p-2 border-b border-gray-300">
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-200 rounded">B</button>
          <button className="p-1 hover:bg-gray-200 rounded">I</button>
          <button className="p-1 hover:bg-gray-200 rounded">U</button>
          <span className="border-r border-gray-300 mx-1"></span>
          <button className="p-1 hover:bg-gray-200 rounded">H1</button>
          <button className="p-1 hover:bg-gray-200 rounded">H2</button>
          <button className="p-1 hover:bg-gray-200 rounded">H3</button>
          <span className="border-r border-gray-300 mx-1"></span>
          <button className="p-1 hover:bg-gray-200 rounded flex items-center">
            <PictureOutlined />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={12}
        placeholder="输入文章内容..."
        className="w-full p-4 focus:outline-none"
      />
    </div>
  );
};

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'article' | 'pdf' | 'wechat';
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: string;
  likes: number;
  comments: any[];
  readTime: number;
  fileUrl?: string;
  fileSize?: string;
  filePages?: string | number;
  originalLink?: string;
  wechatAccount?: string;
  summary?: string;
}

export default function NewKnowledgePage() {
  const router = useRouter();
  const fileInputRef = useRef(null as HTMLInputElement | null);
  
  const [contentType, setContentType] = useState('article' as 'article' | 'pdf' | 'wechat');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('/images/default-cover.svg');
  const [pdfFile, setPdfFile] = useState(null as File | null);
  const [wechatLink, setWechatLink] = useState('');
  const [wechatAccount, setWechatAccount] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 分类选项
  const categories = [
    { id: 'tech', name: '技术分享' },
    { id: 'management', name: '管理经验' },
    { id: 'industry', name: '行业资讯' },
  ];
  
  // 处理表单提交
  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // 验证表单
    if (!title.trim()) {
      alert('请输入标题');
      setIsSubmitting(false);
      return;
    }
    
    if (contentType === 'article' && !content.trim()) {
      alert('请输入文章内容');
      setIsSubmitting(false);
      return;
    }
    
    if (contentType === 'pdf' && !pdfFile) {
      alert('请上传PDF文件');
      setIsSubmitting(false);
      return;
    }
    
    if (contentType === 'wechat' && !wechatLink.trim()) {
      alert('请输入微信文章链接');
      setIsSubmitting(false);
      return;
    }
    
    if (!category) {
      alert('请选择分类');
      setIsSubmitting(false);
      return;
    }
    
    // 构建知识内容对象
    const knowledgeItem: KnowledgeItem = {
      id: `knowledge-${Date.now()}`,
      title,
      type: contentType,
      content: contentType === 'article' ? content : 
              contentType === 'wechat' ? summary : 
              '这是一份PDF文档',
      coverImage,
      author: 'Oliver Fang', // 实际项目中应从用户信息获取
      publishDate: new Date().toISOString(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category,
      likes: 0,
      comments: [],
      readTime: Math.max(1, Math.ceil(content.length / 1000)), // 简单估算
    };
    
    // 根据内容类型添加特定字段
    if (contentType === 'pdf' && pdfFile) {
      knowledgeItem.fileUrl = URL.createObjectURL(pdfFile);
      knowledgeItem.fileSize = `${(pdfFile.size / (1024 * 1024)).toFixed(2)}MB`;
      knowledgeItem.filePages = '未知'; // 实际项目中可能需要分析PDF获取页数
    } else if (contentType === 'wechat') {
      knowledgeItem.originalLink = wechatLink;
      knowledgeItem.wechatAccount = wechatAccount;
      knowledgeItem.summary = summary;
    }
    
    console.log('发布知识内容:', knowledgeItem);
    
    // 实际项目中，这里应该调用API将内容保存到数据库
    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // 3秒后跳转到知识列表页面
      setTimeout(() => {
        router.push('/knowledge');
      }, 3000);
    }, 1500);
  };
  
  // 处理PDF文件上传
  const handleFileChange = (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        alert('请上传PDF格式的文件');
      }
    }
  };
  
  // 触发文件选择器
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 返回链接 */}
      <div className="mb-8">
        <Link href="/knowledge" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeftOutlined className="mr-2" />
          返回知识列表
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">分享知识内容</h1>
        
        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircleOutlined className="text-5xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">发布成功！</h2>
            <p className="text-gray-600 mb-6">您的知识内容已成功发布，即将跳转到知识列表页面...</p>
            <Link 
              href="/knowledge"
              className="btn-primary bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
            >
              立即前往
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 内容类型选择 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">内容类型</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setContentType('article')}
                  className={`p-6 rounded-lg border-2 flex flex-col items-center ${
                    contentType === 'article' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileTextOutlined className={`text-4xl mb-2 ${contentType === 'article' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contentType === 'article' ? 'text-primary' : 'text-gray-900'}`}>原创文章</span>
                  <p className="text-sm text-gray-500 mt-2 text-center">发布自己撰写的原创内容</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setContentType('pdf')}
                  className={`p-6 rounded-lg border-2 flex flex-col items-center ${
                    contentType === 'pdf' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FilePdfOutlined className={`text-4xl mb-2 ${contentType === 'pdf' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contentType === 'pdf' ? 'text-primary' : 'text-gray-900'}`}>PDF文档</span>
                  <p className="text-sm text-gray-500 mt-2 text-center">上传PDF格式的文档资料</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setContentType('wechat')}
                  className={`p-6 rounded-lg border-2 flex flex-col items-center ${
                    contentType === 'wechat' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <WechatOutlined className={`text-4xl mb-2 ${contentType === 'wechat' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contentType === 'wechat' ? 'text-primary' : 'text-gray-900'}`}>微信文章</span>
                  <p className="text-sm text-gray-500 mt-2 text-center">分享微信公众号文章链接</p>
                </button>
              </div>
            </div>
            
            {/* 基本信息 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="输入知识内容标题..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                    分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">选择分类...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
                    标签 <span className="text-gray-500 text-sm font-normal">(用逗号分隔)</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                    <TagOutlined className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="tags"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="半导体, 测试, 生产管理..."
                      className="flex-1 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    封面图片
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-4">
                      <Image 
                        src={coverImage}
                        alt="封面预览"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
                    >
                      <UploadOutlined className="mr-2" />
                      上传封面图片
                    </button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      推荐尺寸：1200×600px，JPG/PNG格式
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 内容区域 - 根据类型展示不同表单 */}
            {contentType === 'article' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">文章内容</h2>
                <RichTextEditor 
                  value={content}
                  onChange={setContent}
                />
                <p className="text-sm text-gray-500 mt-2">
                  支持文本格式化、图片插入等基本编辑功能
                </p>
              </div>
            )}
            
            {contentType === 'pdf' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">PDF文档</h2>
                <div className="border border-gray-300 rounded-md p-8 text-center">
                  <FilePdfOutlined className="text-5xl text-gray-400 mb-4" />
                  
                  {pdfFile ? (
                    <div>
                      <p className="font-medium mb-2">{pdfFile.name}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="btn-outline py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        更换文件
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4">点击下方按钮上传PDF文档</p>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="btn-primary bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition flex items-center mx-auto"
                      >
                        <UploadOutlined className="mr-2" />
                        选择PDF文件
                      </button>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            
            {contentType === 'wechat' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">微信文章</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="wechatLink" className="block text-gray-700 font-medium mb-2">
                      文章链接 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="wechatLink"
                      value={wechatLink}
                      onChange={e => setWechatLink(e.target.value)}
                      placeholder="https://mp.weixin.qq.com/s/..."
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      请输入微信公众号文章的完整链接
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="wechatAccount" className="block text-gray-700 font-medium mb-2">
                      公众号名称
                    </label>
                    <input
                      type="text"
                      id="wechatAccount"
                      value={wechatAccount}
                      onChange={e => setWechatAccount(e.target.value)}
                      placeholder="例如：半导体生产专家"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">
                      文章摘要 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="summary"
                      value={summary}
                      onChange={e => setSummary(e.target.value)}
                      rows={4}
                      placeholder="请简要描述文章的主要内容..."
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/knowledge')}
                className="btn-outline mr-4 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="btn-primary bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? '正在发布...' : '发布内容'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 