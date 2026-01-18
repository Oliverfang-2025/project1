"use client";

import React, { useState, useEffect } from 'react';
import {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} from '@/lib/knowledge-storage';
import { Article } from '@/types/knowledge';

type TabType = 'all' | 'free' | 'paid';
type ModalMode = 'create' | 'edit' | null;

export default function KnowledgeManagementPage() {
  const [articles, setArticles] = useState([] as Article[]);
  const [activeTab, setActiveTab] = useState('all' as TabType);
  const [modalMode, setModalMode] = useState(null as ModalMode);
  const [selectedArticle, setSelectedArticle] = useState(null as Article | null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load articles
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    setArticles(getArticles());
  };

  // Filter articles based on tab and search
  const filteredArticles = articles.filter(article => {
    const matchesTab = activeTab === 'all' || article.type === activeTab;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle create/edit
  const handleSave = (formData: Partial<Article>) => {
    if (modalMode === 'create') {
      addArticle(formData as Omit<Article, 'id' | 'createdAt' | 'updatedAt'>);
    } else if (modalMode === 'edit' && selectedArticle) {
      updateArticle(selectedArticle.id, formData);
    }
    loadArticles();
    setModalMode(null);
    setSelectedArticle(null);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      deleteArticle(id);
      loadArticles();
    }
  };

  // Open modal
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedArticle(null);
  };

  const openEditModal = (article: Article) => {
    setModalMode('edit');
    setSelectedArticle(article);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">知识管理</h2>
          <p className="text-gray-600 mt-1">管理免费文章和付费专栏</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          + 新建文章
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            全部 ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('free')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'free'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            免费文章 ({articles.filter(a => a.type === 'free').length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'paid'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            付费专栏 ({articles.filter(a => a.type === 'paid').length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索文章标题或分类..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布日期
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? '没有找到匹配的文章' : '暂无文章，点击"新建文章"开始创建'}
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{article.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.type === 'free'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {article.type === 'free' ? '免费' : `¥${article.price}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.publishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(article)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalMode && (
        <ArticleModal
          mode={modalMode}
          article={selectedArticle}
          onSave={handleSave}
          onClose={() => {
            setModalMode(null);
            setSelectedArticle(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function ArticleModal({
  mode,
  article,
  onSave,
  onClose
}: {
  mode: 'create' | 'edit';
  article: Article | null;
  onSave: (data: Partial<Article>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || '',
    type: article?.type || 'free' as 'free' | 'paid',
    readTime: article?.readTime || 0,
    price: article?.price || 0,
    publishDate: article?.publishDate || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? '新建文章' : '编辑文章'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章标题 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章摘要 *
              </label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类 *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="例如：前端开发、后端开发、系统架构"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                类型 *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'free' | 'paid' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="free">免费文章</option>
                <option value="paid">付费专栏</option>
              </select>
            </div>

            {formData.type === 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  阅读时间（分钟）
                </label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {formData.type === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  价格（元）
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发布日期 *
              </label>
              <input
                type="date"
                required
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章内容 *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="支持 Markdown 格式"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {mode === 'create' ? '创建' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
