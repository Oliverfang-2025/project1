"use client";

import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  StarOff,
  ExternalLink,
  Github,
  CheckCircle,
  Clock,
  Code2
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

interface Project {
  id: number;
  title_zh: string;
  title_en: string | null;
  slug: string;
  description_zh: string | null;
  description_en: string | null;
  cover_image: string | null;
  tech_stack: string[] | null;
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface FormData {
  title_zh: string;
  title_en: string;
  slug: string;
  description_zh: string;
  description_en: string;
  cover_image: string;
  tech_stack: string;
  demo_url: string;
  github_url: string;
  featured: boolean;
  status: 'draft' | 'published';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null) as any;
  const [formData, setFormData] = useState({
    title_zh: '',
    title_en: '',
    slug: '',
    description_zh: '',
    description_en: '',
    cover_image: '',
    tech_stack: '',
    demo_url: '',
    github_url: '',
    featured: false,
    status: 'draft'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, statusFilter, featuredFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      if (statusFilter) params.append('status', statusFilter);
      if (featuredFilter) params.append('featured', featuredFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/projects?${params}`);
      const json = await res.json();

      if (json.data) {
        setProjects(json.data);
        setPagination(json.pagination);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadProjects();
  };

  const openCreateForm = () => {
    setSelectedProject(null);
    setFormData({
      title_zh: '',
      title_en: '',
      slug: '',
      description_zh: '',
      description_en: '',
      cover_image: '',
      tech_stack: '',
      demo_url: '',
      github_url: '',
      featured: false,
      status: 'draft'
    });
    setShowForm(true);
  };

  const openEditForm = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title_zh: project.title_zh,
      title_en: project.title_en || '',
      slug: project.slug,
      description_zh: project.description_zh || '',
      description_en: project.description_en || '',
      cover_image: project.cover_image || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      featured: project.featured,
      status: project.status
    });
    setShowForm(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadProjects();
        setShowDelete(false);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
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
        tech_stack: formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
      };

      const url = selectedProject
        ? `/api/projects/${selectedProject.id}`
        : '/api/projects';
      const method = selectedProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        loadProjects();
        setShowForm(false);
      } else {
        const json = await res.json();
        alert(json.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">项目管理</h1>
          <p className="text-foreground-muted mt-1">管理项目展示</p>
        </div>
        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="w-4 h-4" />
          新建项目
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                <p className="text-sm text-foreground-muted">总项目数</p>
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
                  {projects.filter(p => p.status === 'published').length}
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
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter(p => p.featured).length}
                </p>
                <p className="text-sm text-foreground-muted">精选项目</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-500/10 rounded-lg text-secondary-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter(p => p.github_url).length}
                </p>
                <p className="text-sm text-foreground-muted">开源项目</p>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
            <select
              className="flex h-10 rounded-md border border-border bg-background-secondary px-3 text-sm"
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
            >
              <option value="">全部</option>
              <option value="true">精选</option>
              <option value="false">普通</option>
            </select>
            <div className="flex items-center text-sm text-foreground-muted">
              共 {pagination.total} 个项目
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-foreground-muted">加载中...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-foreground-muted">暂无项目</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-medium text-foreground-muted">标题</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">技术栈</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">状态</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">精选</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">链接</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">更新时间</th>
                    <th className="p-4 text-sm font-medium text-foreground-muted">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b border-border hover:bg-background-tertiary">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{project.title_zh}</div>
                        {project.title_en && (
                          <div className="text-sm text-foreground-muted">{project.title_en}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {project.tech_stack && project.tech_stack.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {project.tech_stack.slice(0, 3).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-background-tertiary rounded text-xs">
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack.length > 3 && (
                              <span className="px-2 py-1 bg-background-tertiary rounded text-xs">
                                +{project.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          project.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {project.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="p-4">
                        {project.featured ? (
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <StarOff className="w-5 h-5 text-foreground-muted" />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 text-foreground-muted hover:text-foreground" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 text-foreground-muted hover:text-foreground" />
                            </a>
                          )}
                          {!project.demo_url && !project.github_url && '-'}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{formatDate(project.updated_at)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project)}
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
            <DialogTitle>{selectedProject ? '编辑项目' : '新建项目'}</DialogTitle>
            <DialogDescription>
              {selectedProject ? '修改项目信息' : '创建新项目'}
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
                  placeholder="project-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">中文描述</label>
                <textarea
                  className="flex w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm"
                  rows={3}
                  value={formData.description_zh}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">英文描述</label>
                <textarea
                  className="flex w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm"
                  rows={3}
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                />
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
                <label className="block text-sm font-medium mb-2">技术栈 (逗号分隔)</label>
                <Input
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">演示链接</label>
                  <Input
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub 链接</label>
                  <Input
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    设为精选项目
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                取消
              </Button>
              <Button type="submit" loading={submitting}>
                {selectedProject ? '更新' : '创建'}
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
              确定要删除项目 &quot;{selectedProject?.title_zh}&quot; 吗？此操作不可撤销。
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
