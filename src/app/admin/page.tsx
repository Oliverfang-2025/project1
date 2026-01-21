"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Bell,
  FileText,
  Share2,
  ArrowRight,
  Activity,
  Clock,
  Database
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  path: string;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState([] as StatCard[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedMessages = localStorage.getItem('contactMessages');
      const messagesCount = storedMessages ? JSON.parse(storedMessages).length : 0;
      const unreadMessages = storedMessages
        ? JSON.parse(storedMessages).filter((msg: any) => !msg.read).length
        : 0;

      setStats([
        {
          title: '总消息数',
          value: messagesCount,
          description: '收到的总联系消息数',
          icon: Mail,
          path: '/admin/messages',
          color: 'bg-blue-500/10 text-blue-400'
        },
        {
          title: '未读消息',
          value: unreadMessages,
          description: '待处理的新消息',
          icon: Bell,
          path: '/admin/messages',
          color: 'bg-amber-500/10 text-amber-400'
        },
        {
          title: '文章数',
          value: '-',
          description: '已发布的文章',
          icon: FileText,
          path: '/admin/articles',
          color: 'bg-green-500/10 text-green-400'
        },
        {
          title: '项目数',
          value: '-',
          description: '展示的项目',
          icon: Share2,
          path: '/admin/projects',
          color: 'bg-purple-500/10 text-purple-400'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const quickActions = [
    {
      title: '查看/回复消息',
      description: '管理收到的联系消息',
      path: '/admin/messages',
      icon: Mail
    },
    {
      title: '管理文章',
      description: '发布和编辑文章内容',
      path: '/admin/articles',
      icon: FileText
    },
    {
      title: '管理项目',
      description: '添加和编辑项目展示',
      path: '/admin/projects',
      icon: Share2
    },
    {
      title: '站点配置',
      description: '更新网站全局配置',
      path: '/admin/site-config',
      icon: Activity
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          欢迎回来
        </h1>
        <p className="text-foreground-muted">
          这里是您的网站管理仪表盘，您可以在这里管理网站的所有内容。
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-12 bg-background-tertiary rounded-lg w-12"></div>
                  <div className="h-6 bg-background-tertiary rounded w-20"></div>
                  <div className="h-4 bg-background-tertiary rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                href={stat.path}
                key={index}
                className="group"
              >
                <Card className="border-border hover:border-primary-500/50 transition-all duration-200 hover:shadow-glow-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${stat.color} mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-foreground-subtle group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                    <p className="text-sm text-foreground-muted">{stat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.path}>
                <Card className="border-border hover:border-primary-500/50 transition-all duration-200 hover:shadow-glow-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                        <p className="text-sm text-foreground-muted">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-foreground-subtle" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Info */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">系统信息</h2>
        <Card className="border-border">
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>当前系统和配置信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="font-medium text-foreground">系统版本</p>
                    <p className="text-sm text-foreground-muted">当前系统版本号</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full border border-green-500/20">
                  v1.0.0
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="font-medium text-foreground">最后登录</p>
                    <p className="text-sm text-foreground-muted">您上次登录的时间</p>
                  </div>
                </div>
                <span className="text-sm text-foreground-muted">
                  {new Date().toLocaleString('zh-CN')}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="font-medium text-foreground">数据存储</p>
                    <p className="text-sm text-foreground-muted">数据库和本地存储</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full border border-primary-500/20">
                    Neon PostgreSQL
                  </span>
                  <span className="px-3 py-1 bg-background-tertiary text-foreground-muted text-sm font-medium rounded-full border border-border">
                    LocalStorage
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
