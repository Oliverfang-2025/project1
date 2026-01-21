"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Trash2,
  Check,
  Search,
  Inbox,
  Clock
} from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    try {
      const storedMessages = localStorage.getItem('contactMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: number) => {
    const updated = messages.map(msg =>
      msg.id === id ? { ...msg, read: true } : msg
    );
    setMessages(updated);
    localStorage.setItem('contactMessages', JSON.stringify(updated));
  };

  const deleteMessage = (id: number) => {
    if (confirm('确定要删除这条消息吗？')) {
      const updated = messages.filter(msg => msg.id !== id);
      setMessages(updated);
      localStorage.setItem('contactMessages', JSON.stringify(updated));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">消息管理</h1>
          <p className="text-foreground-muted mt-1">管理网站收到的联系消息</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{messages.length}</p>
                <p className="text-sm text-foreground-muted">总消息数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-sm text-foreground-muted">未读消息</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{messages.length - unreadCount}</p>
                <p className="text-sm text-foreground-muted">已读消息</p>
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
              placeholder="搜索消息..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {loading ? (
        <Card className="border-border">
          <CardContent className="p-12">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          </CardContent>
        </Card>
      ) : filteredMessages.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Mail className="w-16 h-16 text-foreground-subtle mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无消息</h3>
            <p className="text-foreground-muted">
              {searchTerm ? '没有找到匹配的消息' : '目前还没有收到任何联系消息'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`border-border transition-all duration-200 ${
                !message.read ? 'bg-primary-500/5 border-primary-500/30' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {!message.read && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                      )}
                      <h3 className="text-lg font-semibold text-foreground">
                        {message.subject || '无主题'}
                      </h3>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-foreground-muted">
                        <span className="font-medium text-foreground">姓名:</span> {message.name}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        <span className="font-medium text-foreground">邮箱:</span> {message.email}
                      </p>
                      <p className="text-sm text-foreground-subtle flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.date)}
                      </p>
                    </div>
                    <p className="text-foreground bg-background-tertiary p-3 rounded-lg text-sm">
                      {message.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!message.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(message.id)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        标记已读
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                      className="gap-1 hover:text-error hover:border-error"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
