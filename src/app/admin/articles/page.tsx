"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Article {
  id: number;
  title_zh: string;
  title_en: string | null;
  slug: string;
  excerpt_zh: string | null;
  excerpt_en: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  status: 'draft' | 'published' | 'archived';
  author: string | null;
  view_count: number;
  created_at: string;
  published_at: string | null;
}

interface FormData {
  title_zh: string;
  title_en: string;
  slug: string;
  content_zh: string;
  content_en: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string;
  category: string;
  tags: string;
  status: 'draft' | 'published';
  author: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null) as any;
  const [formData, setFormData] = useState({
    title_zh: '',
    title_en: '',
    slug: '',
    content_zh: '',
    content_en: '',
    excerpt_zh: '',
    excerpt_en: '',
    cover_image: '',
    category: '',
    tags: '',
    status: 'draft',
    author: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadArticles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, categoryFilter, statusFilter]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/articles?${params}`);
      const json = await res.json();

      if (json.data) {
        setArticles(json.data);
        setPagination(json.pagination);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadArticles();
  };

  const openCreateForm = () => {
    setSelectedArticle(null);
    setFormData({
      title_zh: '',
      title_en: '',
      slug: '',
      content_zh: '',
      content_en: '',
      excerpt_zh: '',
      excerpt_en: '',
      cover_image: '',
      category: '',
      tags: '',
      status: 'draft',
      author: ''
    });
    setShowForm(true);
  };

  const openEditForm = (article: any) => {
    setSelectedArticle(article);
    setFormData({
      title_zh: article.title_zh,
      title_en: article.title_en || '',
      slug: article.slug,
      content_zh: '',
      content_en: '',
      excerpt_zh: article.excerpt_zh || '',
      excerpt_en: (article as any).excerpt_en || '',
      cover_image: article.cover_image || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      status: article.status === 'archived' ? 'draft' : article.status,
      author: article.author || ''
    });
    setShowForm(true);
  };

  const handleDelete = (article: any) => {
    setSelectedArticle(article);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadArticles();
        setShowDelete(false);
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const url = selectedArticle
        ? `/api/articles/${selectedArticle.id}`
        : '/api/articles';
      const method = selectedArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        loadArticles();
        setShowForm(false);
      } else {
        const json = await res.json();
        alert(json.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const categories = Array.from(new Set(articles.map((a: any) => a.category).filter(Boolean))) as string[];
  const statuses = ['draft', 'published', 'archived'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
          <p className="text-foreground-muted mt-1">管理网站文章内容</p>
        </div>
        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="w-4 h-4" />
          新建文章
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                <p className="text-sm text-foreground-muted">总文章数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {articles.filter(a => a.status === 'published').length}
                </p>
                <p className="text-sm text-foreground-muted">已发布</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {articles.filter(a => a.status === 'draft').length}
                </p>
                <p className="text-sm text-foreground-muted">草稿</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-500/10 rounded-lg text-secondary-400">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {articles.reduce((sum, a) => sum + a.view_count, 0)}
                </p>
                <p className="text-sm text-foreground-muted">总浏览量</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="搜索标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <select
              className="flex h-10 rounded-md border border-border bg-background-secondary px-3 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">全部分类</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className="flex h-10 rounded-md border border-border bg-background-secondary px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">全部状态</option>
              {statuses.map(s => (
                <option key={s} value={s}>
                  {s === 'draft' ? '草稿' : s === 'published' ? '已发布' : '已归档'}
                </option>
              ))}
            </select>
            <div className="flex items-center text-sm text-foreground-muted">
              共 {pagination.total} 篇文章
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-foreground-muted">加载中...</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-foreground-muted">暂无文章</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-medium text-foreground-muted">标题</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">分类</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">状态</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">作者</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">浏览</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">发布时间</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} className="border-b border-border hover:bg-background-tertiary">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{article.title_zh}</div>
                        {article.title_en && (
                          <div className="text-sm text-foreground-muted">{article.title_en}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {article.category ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background-tertiary text-xs">
                            <Tag className="w-3 h-3" />
                            {article.category}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          article.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : article.status === 'draft'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {article.status === 'published' ? '已发布' : article.status === 'draft' ? '草稿' : '已归档'}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{article.author || '-'}</td>
                      <td className="p-4 text-sm">{article.view_count}</td>
                      <td className="p-4 text-sm">{formatDate(article.published_at)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(article)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article)}
                          >
                            <Trash2 className="w-4 h-4 text-error" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          >
            上一页
          </Button>
          <span className="flex items-center px-4 text-sm text-foreground-muted">
            第 {pagination.page} / {pagination.totalPages} 页
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          >
            下一页
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle ? '编辑文章' : '新建文章'}</DialogTitle>
            <DialogDescription>
              {selectedArticle ? '修改文章信息' : '创建新文章'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">中文标题 *</label>
                  <Input
                    required
                    value={formData.title_zh}
                    onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">英文标题</label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="article-slug"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="技术分享"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">作者</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">封面图 URL</label>
                <Input
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">标签 (逗号分隔)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, TypeScript, Next.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">中文摘要</label>
                <textarea
                  className="flex w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm"
                  rows={3}
                  value={formData.excerpt_zh}
                  onChange={(e) => setFormData({ ...formData, excerpt_zh: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">英文摘要</label>
                <textarea
                  className="flex w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm"
                  rows={3}
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">状态</label>
                <select
                  className="flex w-full h-10 rounded-md border border-border bg-background-secondary px-3 text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="draft">草稿</option>
                  <option value="published">发布</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                取消
              </Button>
              <Button type="submit" loading={submitting}>
                {selectedArticle ? '更新' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除文章 &quot;{selectedArticle?.title_zh}&quot; 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete} loading={submitting}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
