"use client";

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Mail,
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
  Link as LinkIcon,
  FileText,
  MessageSquare,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SiteConfig {
  [key: string]: any;
}

export default function SiteConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null) as any;
  const [config, setConfig] = useState({}) as any;

  useEffect(() => {
    loadConfig();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/site-config');
      if (res.ok) {
        const json = await res.json();
        setConfig(json.data || {});
      }
    } catch (err) {
      console.error('Failed to load config:', err);
      showMessage('error', '加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Convert config to array of {key, value} pairs
      const configs = Object.entries(config).map(([key, value]) => ({ key, value }));

      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs })
      });

      if (res.ok) {
        showMessage('success', '配置保存成功');
        loadConfig();
      } else {
        const json = await res.json();
        showMessage('error', json.error || '保存失败');
      }
    } catch (err) {
      console.error('Failed to save config:', err);
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const configSections = [
    {
      title: '网站基本信息',
      icon: Globe,
      fields: [
        { key: 'site.name', label: '网站名称', type: 'text', placeholder: '我的网站' },
        { key: 'site.description', label: '网站描述', type: 'text', placeholder: '网站简介' },
        { key: 'site.keywords', label: '关键词', type: 'text', placeholder: '关键词1, 关键词2' },
        { key: 'site.author', label: '作者名称', type: 'text', placeholder: '作者名' },
      ]
    },
    {
      title: '联系信息',
      icon: Mail,
      fields: [
        { key: 'contact.email', label: '邮箱', type: 'email', placeholder: 'contact@example.com' },
        { key: 'contact.phone', label: '电话', type: 'text', placeholder: '+86 xxx xxxx xxxx' },
        { key: 'contact.wechat', label: '微信号', type: 'text', placeholder: 'wechat_id' },
        { key: 'contact.location', label: '地址', type: 'text', placeholder: '城市, 国家' },
      ]
    },
    {
      title: '社交媒体',
      icon: LinkIcon,
      fields: [
        { key: 'social.github', label: 'GitHub', type: 'text', placeholder: 'https://github.com/username' },
        { key: 'social.twitter', label: 'Twitter', type: 'text', placeholder: 'https://twitter.com/username' },
        { key: 'social.linkedin', label: 'LinkedIn', type: 'text', placeholder: 'https://linkedin.com/in/username' },
        { key: 'social.weibo', label: '微博', type: 'text', placeholder: 'https://weibo.com/username' },
      ]
    },
    {
      title: 'SEO 配置',
      icon: FileText,
      fields: [
        { key: 'seo.og_title', label: 'OG 标题', type: 'text', placeholder: 'Open Graph 标题' },
        { key: 'seo.og_description', label: 'OG 描述', type: 'text', placeholder: 'Open Graph 描述' },
        { key: 'seo.og_image', label: 'OG 图片', type: 'text', placeholder: 'https://example.com/og-image.jpg' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">站点配置</h1>
          <p className="text-foreground-muted mt-1">管理网站全局设置</p>
        </div>
        <Button onClick={handleSave} loading={saving} className="gap-2">
          <Save className="w-4 h-4" />
          保存配置
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-error/10 text-error border border-error/20'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-foreground-muted">加载中...</div>
      ) : (
        <div className="space-y-6">
          {configSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary-400" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-2">{field.label}</label>
                        <Input
                          type={field.type}
                          value={config[field.key] || ''}
                          onChange={(e) => updateConfig(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Additional Config */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-400" />
                其他配置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                  <Input
                    type="text"
                    value={config['analytics.google_id'] || ''}
                    onChange={(e) => updateConfig('analytics.google_id', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">自定义 Footer 内容</label>
                  <textarea
                    className="flex w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm"
                    rows={3}
                    value={config['site.footer'] || ''}
                    onChange={(e) => updateConfig('site.footer', e.target.value)}
                    placeholder="自定义页脚内容"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
