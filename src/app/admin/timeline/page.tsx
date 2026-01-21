"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Tag,
  Heart,
  MessageCircle
} from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
}

export default function TimelinePage() {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTimelineItems();
  }, []);

  const loadTimelineItems = () => {
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem('timelineItems');
      let items: TimelineItem[] = stored ? JSON.parse(stored) : [];

      if (items.length === 0) {
        items = [
          {
            id: '1',
            title: '参加Web技术研讨会',
            date: '2023-07-15',
            content: '分享了前端优化的经验和最佳实践，收获颇丰',
            likes: 24,
            comments: 8,
            category: '技术'
          },
          {
            id: '2',
            title: '新书推荐：《深入浅出React》',
            date: '2023-06-20',
            content: '最近读了这本书，内容深入浅出，非常推荐给前端开发者',
            likes: 32,
            comments: 12,
            category: '阅读'
          },
          {
            id: '3',
            title: '周末登山记',
            date: '2023-05-28',
            content: '周末和朋友一起去了附近的山，拍了很多美丽的风景照片',
            likes: 45,
            comments: 15,
            category: '生活'
          }
        ];
        localStorage.setItem('timelineItems', JSON.stringify(items));
      }

      setTimelineItems(items);
      setLoading(false);
    }, 500);
  };

  const filteredItems = timelineItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条时间线吗？')) {
      const updated = timelineItems.filter(item => item.id !== id);
      setTimelineItems(updated);
      localStorage.setItem('timelineItems', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">时间线管理</h1>
          <p className="text-foreground-muted mt-1">管理您的经历和里程碑</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          添加事件
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{timelineItems.length}</p>
                <p className="text-sm text-foreground-muted">总时间线数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {timelineItems.reduce((sum, item) => sum + item.likes, 0)}
                </p>
                <p className="text-sm text-foreground-muted">总点赞数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {timelineItems.reduce((sum, item) => sum + item.comments, 0)}
                </p>
                <p className="text-sm text-foreground-muted">总评论数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(timelineItems.map(item => item.category)).size}
                </p>
                <p className="text-sm text-foreground-muted">分类数量</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              placeholder="搜索时间线..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>时间线事件</CardTitle>
          <CardDescription>共 {filteredItems.length} 个事件</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-foreground-subtle mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">暂无时间线事件</h3>
              <p className="text-foreground-muted">
                {searchTerm ? '没有找到匹配的事件' : '点击上方按钮添加您的第一个事件'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-background-tertiary border border-border rounded-lg hover:border-primary-500/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        {item.category && (
                          <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs font-medium rounded-full border border-primary-500/20">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground-muted text-sm mb-3 line-clamp-2">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-foreground-subtle">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {item.comments}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="w-4 h-4" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 hover:text-error hover:border-error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
