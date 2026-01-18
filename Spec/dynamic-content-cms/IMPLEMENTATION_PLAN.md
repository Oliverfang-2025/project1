# 动态内容管理系统 - 详细实施计划

> **项目**: Next.js 个人网站 CMS 动态化改造
> **版本**: 1.0.0
> **创建日期**: 2025-01-18
> **预计工期**: 6-7 小时

---

## 目录

1. [项目概述](#一项目概述)
2. [架构分析](#二架构分析)
3. [P0 阶段实施计划](#三p0-阶段实施计划)
4. [P1 阶段实施计划](#四p1-阶段实施计划)
5. [P2 阶段实施计划](#五p2-阶段实施计划)
6. [代码模板](#六代码模板)
7. [验证标准](#七验证标准)
8. [风险管理](#八风险管理)

---

## 一、项目概述

### 1.1 目标

将网站中 8 个硬编码内容模块改造为后台可管理的动态内容系统，实现完整的 CMS 功能。

### 1.2 改造范围

| 优先级 | 模块 | 后台现状 | 前端状态 | 复杂度 | 预计耗时 |
|--------|------|----------|----------|--------|----------|
| P0 | 社交媒体 | ✅ 已有 | ❌ 硬编码 | 简单 | 30 分钟 |
| P0 | 联系信息 | ✅ 已有 | ❌ 硬编码 | 简单 | 30 分钟 |
| P1 | 兴趣爱好 | ❌ 需新建 | ❌ 硬编码 | 中等 | 1 小时 |
| P1 | 时间线 | ❌ 需新建 | ❌ 硬编码 | 中等 | 1 小时 |
| P1 | 计划管理 | ❌ 需新建 | ❌ 硬编码 | 中等 | 1 小时 |
| P2 | 关于页面 | ❌ 需新建 | ❌ 硬编码 | 复杂 | 1 小时 |
| P2 | 导航管理 | ❌ 需新建 | ❌ 硬编码 | 简单 | 30 分钟 |
| P2 | 页面内容 | ✅ 已有 | ❌ 未集成 | 中等 | 1 小时 |

**总耗时**: 约 6-7 小时

### 1.3 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (strict: false)
- **存储**: localStorage
- **样式**: Tailwind CSS
- **状态**: React Hooks (useState, useEffect)

---

## 二、架构分析

### 2.1 现有模式（需严格遵循）

#### 存储层模式
参考文件: [`src/lib/knowledge-storage.ts`](../../src/lib/knowledge-storage.ts)

```typescript
// 核心原则
- localStorage 键命名: {模块}_{实体复数}  // 例如: knowledge_articles
- 包装对象: { items: T[], version: string, lastModified: number }
- SSR 安全: typeof window === 'undefined' 检查
- 错误处理: try-catch + console.error + 返回默认值
```

#### 管理后台模式
参考文件: [`src/app/admin/knowledge/page.tsx`](../../src/app/admin/knowledge/page.tsx)

```typescript
// UI 组件
- Ant Design Table 组件展示列表
- Modal 组件用于创建/编辑表单
- 标签页切换过滤数据
- 搜索过滤功能
- 确认对话框删除操作
```

### 2.2 关键文件清单

#### 需要创建的文件 (15 个)

| 类型 | 文件路径 | 说明 |
|------|----------|------|
| 类型定义 | `src/types/social.ts` | 社交媒体类型 |
| 类型定义 | `src/types/interest.ts` | 兴趣爱好类型 |
| 类型定义 | `src/types/timeline.ts` | 时间线类型 |
| 类型定义 | `src/types/plan.ts` | 计划类型 |
| 类型定义 | `src/types/personal-info.ts` | 个人信息类型 |
| 类型定义 | `src/types/nav.ts` | 导航类型 |
| 存储层 | `src/lib/social-storage.ts` | 社交媒体存储 |
| 存储层 | `src/lib/contact-storage.ts` | 联系信息存储 |
| 存储层 | `src/lib/interest-storage.ts` | 兴趣存储 |
| 存储层 | `src/lib/timeline-storage.ts` | 时间线存储 |
| 存储层 | `src/lib/plan-storage.ts` | 计划存储 |
| 存储层 | `src/lib/personal-storage.ts` | 个人信息存储 |
| 存储层 | `src/lib/nav-storage.ts` | 导航存储 |
| 管理后台 | `src/app/admin/interests/page.tsx` | 兴趣管理 |
| 管理后台 | `src/app/admin/timeline/page.tsx` | 时间线管理 |
| 管理后台 | `src/app/admin/plans/page.tsx` | 计划管理 |
| 管理后台 | `src/app/admin/personal/page.tsx` | 个人信息管理 |
| 管理后台 | `src/app/admin/navigation/page.tsx` | 导航管理 |

#### 需要修改的文件 (10 个)

| 文件路径 | 修改内容 |
|----------|----------|
| `src/components/layout/Footer.tsx` | 集成社交媒体和联系方式动态数据 |
| `src/app/contact/page.tsx` | 集成联系方式和社交媒体动态数据 |
| `src/app/about/page.tsx` | 集成个人信息动态数据 |
| `src/components/home/InterestSection.tsx` | 从 localStorage 加载数据 |
| `src/components/home/TimelineSection.tsx` | 从 localStorage 加载数据 |
| `src/components/home/PlanSection.tsx` | 从 localStorage 加载数据 |
| `src/components/home/AboutSection.tsx` | 从 localStorage 加载数据 |
| `src/app/navbar/page.tsx` | 从 localStorage 加载导航配置 |
| `src/app/admin/layout.tsx` | 添加新的导航菜单项 |
| `src/app/plans/page.tsx` | 实现计划详情页面 |

---

## 三、P0 阶段实施计划

> **目标**: 完成社交媒体和联系信息的前端集成
> **耗时**: 1 小时
> **依赖**: 无

### 3.1 P0.1 社交媒体集成

#### 数据结构

```typescript
// src/types/social.ts
export interface SocialLink {
  id: string;
  name: string;         // 显示名称: 'B站', '微信公众号'
  url: string;          // 链接地址
  icon: string;         // 图标类型: 'bilibili', 'wechat', 'linkedin'
}

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: '1',
    name: 'B站',
    url: 'https://space.bilibili.com/349326941',
    icon: 'bilibili'
  },
  {
    id: '2',
    name: '微信公众号',
    url: 'javascript:void(0)',
    icon: 'wechat'
  },
  {
    id: '3',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/oliver-fang-503585305/',
    icon: 'linkedin'
  }
];
```

#### 存储层实现

**文件**: `src/lib/social-storage.ts`

```typescript
'use client';

import { SocialLink, DEFAULT_SOCIAL_LINKS } from '@/types/social';

const STORAGE_KEY = 'social_links';

export function getSocialLinks(): SocialLink[] {
  if (typeof window === 'undefined') return DEFAULT_SOCIAL_LINKS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveSocialLinks(DEFAULT_SOCIAL_LINKS);
      return DEFAULT_SOCIAL_LINKS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read social links:', error);
    return DEFAULT_SOCIAL_LINKS;
  }
}

export function saveSocialLinks(links: SocialLink[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.error('Failed to save social links:', error);
  }
}

export function addSocialLink(link: Omit<SocialLink, 'id'>): SocialLink {
  const links = getSocialLinks();
  const newLink: SocialLink = {
    ...link,
    id: Date.now().toString()
  };
  links.push(newLink);
  saveSocialLinks(links);
  return newLink;
}

export function updateSocialLink(id: string, updates: Partial<SocialLink>): SocialLink | null {
  const links = getSocialLinks();
  const index = links.findIndex(link => link.id === id);

  if (index === -1) return null;

  links[index] = { ...links[index], ...updates };
  saveSocialLinks(links);
  return links[index];
}

export function deleteSocialLink(id: string): boolean {
  const links = getSocialLinks();
  const filtered = links.filter(link => link.id !== id);

  if (filtered.length === links.length) return false;

  saveSocialLinks(filtered);
  return true;
}
```

#### Footer 组件修改

**文件**: `src/components/layout/Footer.tsx`

**修改位置**: 第 38-54 行（社交媒体图标区域）

```typescript
// 添加导入
import { useState, useEffect } from 'react';
import { getSocialLinks } from '@/lib/social-storage';
import { SocialLink } from '@/types/social';

// 在 Footer 组件内
const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

useEffect(() => {
  setSocialLinks(getSocialLinks());
}, []);

// 替换硬编码的社交媒体链接渲染
<div className="flex space-x-6">
  {socialLinks.map((link) => (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors"
    >
      {renderSocialIcon(link.icon)}
    </a>
  ))}
</div>
```

#### 验证测试清单

- [ ] 后台添加新的社交媒体链接
- [ ] Footer 实时更新显示新链接
- [ ] 图标正确渲染
- [ ] 链接可点击跳转
- [ ] 编辑链接后更新生效
- [ ] 删除链接后从 Footer 移除

---

### 3.2 P0.2 联系信息集成

#### 数据结构

```typescript
// src/types/contact.ts
export interface ContactInfo {
  phone: string;       // 电话: '13679041859'
  email: string;       // 邮箱: '6358000070@qq.com'
  location: string;    // 地址: '无锡 | 成都-郫都区'
  wechat?: string;     // 微信号（可选）
  whatsapp?: string;   // WhatsApp（可选）
  skype?: string;      // Skype（可选）
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: '13679041859',
  email: '6358000070@qq.com',
  location: '无锡 | 成都-郫都区'
};
```

#### 存储层实现

**文件**: `src/lib/contact-storage.ts`

```typescript
'use client';

import { ContactInfo, DEFAULT_CONTACT_INFO } from '@/types/contact';

const STORAGE_KEY = 'contact_info';

export function getContactInfo(): ContactInfo {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_INFO;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveContactInfo(DEFAULT_CONTACT_INFO);
      return DEFAULT_CONTACT_INFO;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read contact info:', error);
    return DEFAULT_CONTACT_INFO;
  }
}

export function saveContactInfo(info: ContactInfo): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (error) {
    console.error('Failed to save contact info:', error);
  }
}

export function initContactInfo(): ContactInfo {
  const current = getContactInfo();
  if (!current.phone || !current.email) {
    saveContactInfo(DEFAULT_CONTACT_INFO);
    return DEFAULT_CONTACT_INFO;
  }
  return current;
}
```

#### Footer 组件修改

**文件**: `src/components/layout/Footer.tsx`

**修改位置**: 第 99-124 行（联系信息区域）

```typescript
// 添加导入
import { getContactInfo } from '@/lib/contact-storage';
import { ContactInfo } from '@/types/contact';

// 在 Footer 组件内
const [contactInfo, setContactInfo] = useState<ContactInfo>(getContactInfo());

useEffect(() => {
  setContactInfo(getContactInfo());
}, []);

// 替换硬编码联系方式
<div className="space-y-3">
  <li className="flex items-center text-gray-400">
    <span>{contactInfo.email}</span>
  </li>
  <li className="flex items-center text-gray-400">
    <span>+86 {contactInfo.phone}</span>
  </li>
  <li className="flex items-center text-gray-400">
    <span>{contactInfo.location}</span>
  </li>
</div>
```

#### Contact 页面修改

**文件**: `src/app/contact/page.tsx`

```typescript
// 添加导入
import { getContactInfo } from '@/lib/contact-storage';
import { getSocialLinks } from '@/lib/social-storage';

// 在组件内
const [contactInfo, setContactInfo] = useState(getContactInfo());
const [socialLinks, setSocialLinks] = useState([]);

useEffect(() => {
  setContactInfo(getContactInfo());
  setSocialLinks(getSocialLinks());
}, []);
```

#### 验证测试清单

- [ ] 后台修改联系方式
- [ ] Footer 实时更新
- [ ] 邮箱格式验证
- [ ] 必填字段检查
- [ ] Contact 页面同步更新

---

## 四、P1 阶段实施计划

> **目标**: 完成兴趣爱好、时间线、计划管理的动态化
> **耗时**: 3 小时
> **依赖**: P0 阶段完成

### 4.1 P1.1 兴趣爱好管理

#### 数据结构

```typescript
// src/types/interest.ts
export interface Interest {
  id: string;
  name: string;              // 兴趣名称: '摄影', '阅读'
  description: string;       // 描述: '捕捉生活中美好的瞬间'
  imageUrl: string;          // 图片 URL
  category: string;          // 分类: '艺术', '文化', '生活'
  order: number;             // 排序
  visible: boolean;          // 是否显示
  createdAt: number;
  updatedAt: number;
}

export interface InterestsConfig {
  interests: Interest[];
  version: string;
  lastModified: number;
}

export const DEFAULT_INTERESTS: Interest[] = [
  {
    id: '1',
    name: '摄影',
    description: '捕捉生活中美好的瞬间，记录旅行见闻',
    imageUrl: '/images/placeholder.png',
    category: '艺术',
    order: 1,
    visible: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: '阅读',
    description: '涉猎技术、管理、人文等各类书籍',
    imageUrl: '/images/placeholder.png',
    category: '文化',
    order: 2,
    visible: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: '运动健身',
    description: '保持健康的生活方式，定期锻炼',
    imageUrl: '/images/placeholder.png',
    category: '生活',
    order: 3,
    visible: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];
```

#### 存储层实现

**文件**: `src/lib/interest-storage.ts`

```typescript
'use client';

import { Interest, InterestsConfig, DEFAULT_INTERESTS } from '@/types/interest';

const STORAGE_KEY = 'interests_data';

export function getInterests(): Interest[] {
  if (typeof window === 'undefined') return DEFAULT_INTERESTS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveInterests(DEFAULT_INTERESTS);
      return DEFAULT_INTERESTS;
    }
    const config: InterestsConfig = JSON.parse(stored);
    return config.interests;
  } catch (error) {
    console.error('Failed to read interests:', error);
    return DEFAULT_INTERESTS;
  }
}

export function getVisibleInterests(): Interest[] {
  return getInterests()
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);
}

export function saveInterests(interests: Interest[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: InterestsConfig = {
      interests,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save interests:', error);
  }
}

export function addInterest(interest: Omit<Interest, 'id' | 'createdAt' | 'updatedAt'>): Interest {
  const interests = getInterests();
  const newInterest: Interest = {
    ...interest,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  interests.push(newInterest);
  saveInterests(interests);
  return newInterest;
}

export function updateInterest(id: string, updates: Partial<Omit<Interest, 'id' | 'createdAt'>>): Interest | null {
  const interests = getInterests();
  const index = interests.findIndex(item => item.id === id);

  if (index === -1) return null;

  const updatedItem: Interest = {
    ...interests[index],
    ...updates,
    updatedAt: Date.now()
  };

  interests[index] = updatedItem;
  saveInterests(interests);
  return updatedItem;
}

export function deleteInterest(id: string): boolean {
  const interests = getInterests();
  const filtered = interests.filter(item => item.id !== id);

  if (filtered.length === interests.length) return false;

  saveInterests(filtered);
  return true;
}
```

#### 管理后台实现

**文件**: `src/app/admin/interests/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import {
  getInterests,
  addInterest,
  updateInterest,
  deleteInterest
} from '@/lib/interest-storage';
import { Interest } from '@/types/interest';

type ModalMode = 'create' | 'edit' | null;

export default function InterestsManagementPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<Interest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = () => {
    setInterests(getInterests());
  };

  const filteredItems = interests.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (formData: Partial<Interest>) => {
    if (modalMode === 'create') {
      addInterest(formData as Omit<Interest, 'id' | 'createdAt' | 'updatedAt'>);
    } else if (modalMode === 'edit' && selectedItem) {
      updateInterest(selectedItem.id, formData);
    }
    loadInterests();
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除吗？此操作不可恢复。')) {
      deleteInterest(id);
      loadInterests();
    }
  };

  const toggleVisibility = (id: string) => {
    const item = interests.find(i => i.id === id);
    if (item) {
      updateInterest(id, { visible: !item.visible });
      loadInterests();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">兴趣爱好管理</h2>
          <p className="text-gray-600 mt-1">管理个人兴趣爱好内容</p>
        </div>
        <button
          onClick={() => setModalMode('create')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + 新建兴趣
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索兴趣名称或分类..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">可见</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className={`text-sm ${item.visible ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {item.visible ? '显示' : '隐藏'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setModalMode('edit');
                      setSelectedItem(item);
                    }}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalMode && (
        <InterestModal
          mode={modalMode}
          item={selectedItem}
          onSave={handleSave}
          onClose={() => {
            setModalMode(null);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

function InterestModal({
  mode,
  item,
  onSave,
  onClose
}: {
  mode: 'create' | 'edit';
  item: Interest | null;
  onSave: (data: Partial<Interest>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    category: item?.category || '',
    order: item?.order || 0,
    visible: item?.visible ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {mode === 'create' ? '新建兴趣' : '编辑兴趣'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">选择分类</option>
                <option value="艺术">艺术</option>
                <option value="文化">文化</option>
                <option value="生活">生活</option>
                <option value="运动">运动</option>
                <option value="技术">技术</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">图片 URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://oss.of2088.top/images/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">显示在首页</span>
                </label>
              </div>
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
```

#### 首页组件修改

**文件**: `src/components/home/InterestSection.tsx`

```typescript
// 添加导入
import { getVisibleInterests } from '@/lib/interest-storage';
import { Interest } from '@/types/interest';

// 在组件内
const [interests, setInterests] = useState<Interest[]>([]);

useEffect(() => {
  setInterests(getVisibleInterests());
}, []);

// 使用 interests 数据渲染
```

#### 验证测试清单

- [ ] 后台添加兴趣项
- [ ] 编辑兴趣内容
- [ ] 删除兴趣
- [ ] 首页实时更新
- [ ] 排序功能正常
- [ ] 可见性切换生效
- [ ] 分类标签正确显示

---

### 4.2 P1.2 时间线管理

#### 数据结构

```typescript
// src/types/timeline.ts
export interface TimelineItem {
  id: string;
  title: string;           // 标题: '参加Web技术研讨会'
  date: string;            // 日期: '2023-07-15'
  content: string;         // 内容: '分享了前端优化的经验...'
  imageUrl?: string;       // 图片 URL（可选）
  likes: number;           // 点赞数
  comments: number;        // 评论数
  category?: string;       // 分类（可选）
  order: number;           // 排序（最新的在前）
  createdAt: number;
  updatedAt: number;
}

export interface TimelineConfig {
  items: TimelineItem[];
  version: string;
  lastModified: number;
}

export const DEFAULT_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: '1',
    title: '参加Web技术研讨会',
    date: '2023-07-15',
    content: '分享了前端优化的经验和最佳实践，收获颇丰',
    likes: 24,
    comments: 8,
    category: '技术',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: '完成半导体工厂生产线优化',
    date: '2023-06-20',
    content: '通过引入新的生产管理流程，效率提升15%',
    likes: 42,
    comments: 15,
    category: '工作',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];
```

#### 存储层实现

**文件**: `src/lib/timeline-storage.ts`

```typescript
'use client';

import { TimelineItem, TimelineConfig, DEFAULT_TIMELINE_ITEMS } from '@/types/timeline';

const STORAGE_KEY = 'timeline_items';

export function getTimelineItems(): TimelineItem[] {
  if (typeof window === 'undefined') return DEFAULT_TIMELINE_ITEMS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveTimelineItems(DEFAULT_TIMELINE_ITEMS);
      return DEFAULT_TIMELINE_ITEMS;
    }
    const config: TimelineConfig = JSON.parse(stored);
    return config.items;
  } catch (error) {
    console.error('Failed to read timeline items:', error);
    return DEFAULT_TIMELINE_ITEMS;
  }
}

export function saveTimelineItems(items: TimelineItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: TimelineConfig = {
      items,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save timeline items:', error);
  }
}

export function addTimelineItem(item: Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'>): TimelineItem {
  const items = getTimelineItems();
  const newItem: TimelineItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  items.unshift(newItem); // 添加到开头
  saveTimelineItems(items);
  return newItem;
}

export function updateTimelineItem(id: string, updates: Partial<Omit<TimelineItem, 'id' | 'createdAt'>>): TimelineItem | null {
  const items = getTimelineItems();
  const index = items.findIndex(item => item.id === id);

  if (index === -1) return null;

  const updatedItem: TimelineItem = {
    ...items[index],
    ...updates,
    updatedAt: Date.now()
  };

  items[index] = updatedItem;
  saveTimelineItems(items);
  return updatedItem;
}

export function deleteTimelineItem(id: string): boolean {
  const items = getTimelineItems();
  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) return false;

  saveTimelineItems(filtered);
  return true;
}
```

#### 管理后台实现

**文件**: `src/app/admin/timeline/page.tsx`

实现模式与 interests 相同，表单字段包括：
- title (必填)
- date (日期选择器)
- content (文本域)
- imageUrl (URL 输入)
- category (下拉选择)
- order (数字输入)
- likes/comments (数字输入，仅显示)

#### 首页组件修改

**文件**: `src/components/home/TimelineSection.tsx`

```typescript
import { getTimelineItems } from '@/lib/timeline-storage';
import { TimelineItem } from '@/types/timeline';

const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

useEffect(() => {
  const items = getTimelineItems();
  setTimelineItems(items.sort((a, b) => b.order - a.order));
}, []);
```

#### 验证测试清单

- [ ] 添加时间线条目
- [ ] 编辑内容
- [ ] 删除条目
- [ ] 日期排序正确
- [ ] 图片显示正常
- [ ] 点赞/评论数显示

---

### 4.3 P1.3 计划管理

#### 数据结构

```typescript
// src/types/plan.ts
export interface Plan {
  id: string;
  title: string;           // 标题: '技术提升计划'
  description: string;     // 描述: '学习最新的前端框架...'
  progress: number;        // 进度: 0-100
  category: string;        // 分类: '职业发展', '个人成长', '健康'
  targetDate?: string;     // 目标日期（可选）
  status: 'active' | 'completed' | 'archived';  // 状态
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface PlansConfig {
  plans: Plan[];
  version: string;
  lastModified: number;
}

export const DEFAULT_PLANS: Plan[] = [
  {
    id: '1',
    title: '技术提升计划',
    description: '学习最新的前端框架和技术，每月至少完成一个技术项目',
    progress: 75,
    category: '职业发展',
    status: 'active',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: '健康管理计划',
    description: '每周运动3次，保持健康的生活方式',
    progress: 60,
    category: '健康',
    status: 'active',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];
```

#### 存储层实现

**文件**: `src/lib/plan-storage.ts`

```typescript
'use client';

import { Plan, PlansConfig, DEFAULT_PLANS } from '@/types/plan';

const STORAGE_KEY = 'plans_data';

export function getPlans(): Plan[] {
  if (typeof window === 'undefined') return DEFAULT_PLANS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      savePlans(DEFAULT_PLANS);
      return DEFAULT_PLANS;
    }
    const config: PlansConfig = JSON.parse(stored);
    return config.plans;
  } catch (error) {
    console.error('Failed to read plans:', error);
    return DEFAULT_PLANS;
  }
}

export function getActivePlans(): Plan[] {
  return getPlans()
    .filter(plan => plan.status === 'active')
    .sort((a, b) => a.order - b.order);
}

export function savePlans(plans: Plan[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: PlansConfig = {
      plans,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save plans:', error);
  }
}

export function addPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Plan {
  const plans = getPlans();
  const newPlan: Plan = {
    ...plan,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  plans.push(newPlan);
  savePlans(plans);
  return newPlan;
}

export function updatePlan(id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt'>>): Plan | null {
  const plans = getPlans();
  const index = plans.findIndex(plan => plan.id === id);

  if (index === -1) return null;

  const updatedPlan: Plan = {
    ...plans[index],
    ...updates,
    updatedAt: Date.now()
  };

  plans[index] = updatedPlan;
  savePlans(plans);
  return updatedPlan;
}

export function deletePlan(id: string): boolean {
  const plans = getPlans();
  const filtered = plans.filter(plan => plan.id !== id);

  if (filtered.length === plans.length) return false;

  savePlans(filtered);
  return true;
}
```

#### 管理后台实现

**文件**: `src/app/admin/plans/page.tsx`

特殊处理：
- 进度条滑块输入 (0-100)
- 状态标签颜色区分
- 日期选择器

#### 首页组件修改

**文件**: `src/components/home/PlanSection.tsx`

```typescript
import { getActivePlans } from '@/lib/plan-storage';

const [plans, setPlans] = useState([]);

useEffect(() => {
  setPlans(getActivePlans());
}, []);
```

#### 计划详情页实现

**文件**: `src/app/plans/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getPlans } from '@/lib/plan-storage';
import { Plan } from '@/types/plan';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">职业规划</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  plan.status === 'active' ? 'bg-green-100 text-green-800' :
                  plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {plan.status === 'active' ? '进行中' :
                   plan.status === 'completed' ? '已完成' : '已归档'}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">进度</span>
                  <span className="font-medium">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">分类: {plan.category}</span>
                {plan.targetDate && <span>目标: {plan.targetDate}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 验证测试清单

- [ ] 添加计划
- [ ] 更新进度
- [ ] 修改状态
- [ ] 首页仅显示活跃计划
- [ ] 进度条正确渲染
- [ ] 计划详情页正常显示

---

## 五、P2 阶段实施计划

> **目标**: 完成关于页面和导航管理的动态化
> **耗时**: 2.5 小时
> **依赖**: P0、P1 阶段完成

### 5.1 P2.1 关于页面动态化

#### 数据结构

```typescript
// src/types/personal-info.ts
export interface PersonalInfo {
  name: string;              // 姓名: 'Oliver Fang'
  title: string;             // 职位: '生产部长'
  industry: string;          // 行业: '半导体/集成电路'
  bio: string;               // 简介
  location: string;          // 位置
  avatarUrl?: string;        // 头像 URL
  education: Education[];    // 教育经历
  experience: Experience[];  // 工作经历
  skills: Skill[];          // 技能
}

export interface Education {
  id: string;
  school: string;            // 学校: '四川大学'
  major: string;             // 专业: '人力资源管理'
  degree: string;            // 学位: '本科'
  period: string;            // 时间段: '2010-2014'
}

export interface Experience {
  id: string;
  company: string;           // 公司
  position: string;          // 职位
  period: string;            // 时间段
  description?: string;      // 描述
}

export interface Skill {
  id: string;
  name: string;              // 技能名称
  level: number;             // 熟练度: 0-100
  category: string;          // 分类
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: 'Oliver Fang',
  title: '生产部长',
  industry: '半导体/集成电路',
  bio: '10年半导体行业经验，专注于生产管理和流程优化',
  location: '无锡 | 成都',
  education: [
    {
      id: '1',
      school: '四川大学',
      major: '人力资源管理',
      degree: '本科',
      period: '2010-2014'
    }
  ],
  experience: [
    {
      id: '1',
      company: '某半导体公司',
      position: '生产部长',
      period: '2020-至今',
      description: '负责生产部门整体运营管理'
    }
  ],
  skills: [
    {
      id: '1',
      name: '生产管理',
      level: 90,
      category: '管理'
    }
  ]
};
```

#### 存储层实现

**文件**: `src/lib/personal-storage.ts`

```typescript
'use client';

import { PersonalInfo, DEFAULT_PERSONAL_INFO } from '@/types/personal-info';

const STORAGE_KEY = 'personal_info';

export function getPersonalInfo(): PersonalInfo {
  if (typeof window === 'undefined') return DEFAULT_PERSONAL_INFO;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      savePersonalInfo(DEFAULT_PERSONAL_INFO);
      return DEFAULT_PERSONAL_INFO;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read personal info:', error);
    return DEFAULT_PERSONAL_INFO;
  }
}

export function savePersonalInfo(info: PersonalInfo): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (error) {
    console.error('Failed to save personal info:', error);
  }
}
```

#### 管理后台实现

**文件**: `src/app/admin/personal/page.tsx`

使用 Tab 组件分别管理：
- 基本信息
- 教育经历
- 工作经历
- 技能

#### 首页组件修改

**文件**: `src/components/home/AboutSection.tsx`

```typescript
import { getPersonalInfo } from '@/lib/personal-storage';

const [personalInfo, setPersonalInfo] = useState(getPersonalInfo());

useEffect(() => {
  setPersonalInfo(getPersonalInfo());
}, []);
```

#### 关于页面修改

**文件**: `src/app/about/page.tsx`

集成个人信息的所有部分

#### 验证测试清单

- [ ] 基本信息保存
- [ ] 教育经历 CRUD
- [ ] 工作经历 CRUD
- [ ] 技能 CRUD
- [ ] 首页和关于页同步更新

---

### 5.2 P2.2 导航管理

#### 数据结构

```typescript
// src/types/nav.ts
export interface NavLink {
  id: string;
  name: string;         // 显示名称: '首页'
  href: string;         // 链接: '/'
  order: number;        // 排序
  visible: boolean;     // 是否显示
  external: boolean;    // 是否外部链接
  icon?: string;        // 图标（可选）
}

export interface NavConfig {
  links: NavLink[];
  version: string;
  lastModified: number;
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { id: '1', name: '首页', href: '/', order: 1, visible: true, external: false },
  { id: '2', name: '关于', href: '/about', order: 2, visible: true, external: false },
  { id: '3', name: '职业规划', href: '/plans', order: 3, visible: true, external: false },
  { id: '4', name: '知识分享', href: '/knowledge', order: 4, visible: true, external: false },
  { id: '5', name: '联系方式', href: '/contact', order: 5, visible: true, external: false }
];
```

#### 存储层实现

**文件**: `src/lib/nav-storage.ts`

```typescript
'use client';

import { NavLink, NavConfig, DEFAULT_NAV_LINKS } from '@/types/nav';

const STORAGE_KEY = 'nav_links';

export function getNavLinks(): NavLink[] {
  if (typeof window === 'undefined') return DEFAULT_NAV_LINKS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveNavLinks(DEFAULT_NAV_LINKS);
      return DEFAULT_NAV_LINKS;
    }
    const config: NavConfig = JSON.parse(stored);
    return config.links;
  } catch (error) {
    console.error('Failed to read nav links:', error);
    return DEFAULT_NAV_LINKS;
  }
}

export function getVisibleNavLinks(): NavLink[] {
  return getNavLinks()
    .filter(link => link.visible)
    .sort((a, b) => a.order - b.order);
}

export function saveNavLinks(links: NavLink[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: NavConfig = {
      links,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save nav links:', error);
  }
}

export function addNavLink(link: Omit<NavLink, 'id'>): NavLink {
  const links = getNavLinks();
  const newLink: NavLink = {
    ...link,
    id: Date.now().toString()
  };
  links.push(newLink);
  saveNavLinks(links);
  return newLink;
}

export function updateNavLink(id: string, updates: Partial<NavLink>): NavLink | null {
  const links = getNavLinks();
  const index = links.findIndex(link => link.id === id);

  if (index === -1) return null;

  links[index] = { ...links[index], ...updates };
  saveNavLinks(links);
  return links[index];
}

export function deleteNavLink(id: string): boolean {
  const links = getNavLinks();
  const filtered = links.filter(link => link.id !== id);

  if (filtered.length === links.length) return false;

  saveNavLinks(filtered);
  return true;
}
```

#### 管理后台实现

**文件**: `src/app/admin/navigation/page.tsx`

使用拖拽排序（参考 sections/page.tsx）

#### 导航组件修改

**文件**: `src/app/navbar/page.tsx`

```typescript
import { getVisibleNavLinks } from '@/lib/nav-storage';

const [navLinks, setNavLinks] = useState([]);

useEffect(() => {
  setNavLinks(getVisibleNavLinks());
}, []);
```

#### 验证测试清单

- [ ] 添加导航链接
- [ ] 编辑链接
- [ ] 删除链接
- [ ] 拖拽排序
- [ ] 可见性切换
- [ ] 导航栏实时更新

---

### 5.3 P2.3 管理后台菜单更新

**文件**: `src/app/admin/layout.tsx`

在导航菜单中添加新的管理项：

```typescript
const menuItems = [
  { path: '/admin', name: '仪表盘', icon: 'home' },
  { path: '/admin/messages', name: '消息管理', icon: 'mail' },
  { path: '/admin/pages', name: '页面内容', icon: 'document' },
  { path: '/admin/sections', name: '首页板块', icon: 'layout' },
  { path: '/admin/knowledge', name: '知识管理', icon: 'book' },
  { path: '/admin/interests', name: '兴趣爱好', icon: 'heart' },
  { path: '/admin/timeline', name: '时间线', icon: 'clock' },
  { path: '/admin/plans', name: '计划管理', icon: 'target' },
  { path: '/admin/personal', name: '个人信息', icon: 'user' },
  { path: '/admin/navigation', name: '导航管理', icon: 'menu' },
  { path: '/admin/social', name: '社交媒体', icon: 'share' },
  { path: '/admin/contact-info', name: '联系方式', icon: 'phone' },
];
```

---

## 六、代码模板

### 6.1 存储层函数模板

```typescript
// {module}-storage.ts

'use client';

import { {Module}Config, DEFAULT_{MODULES} } from '@/types/{module}';

const STORAGE_KEY = '{module}_items';

export function get{Module}s(): {Module}[] {
  if (typeof window === 'undefined') return DEFAULT_{MODULES};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      save{Module}s(DEFAULT_{MODULES});
      return DEFAULT_{MODULES};
    }
    const config: {Module}Config = JSON.parse(stored);
    return config.items;
  } catch (error) {
    console.error('Failed to read items:', error);
    return DEFAULT_{MODULES};
  }
}

export function save{Module}s(items: {Module}[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: {Module}Config = {
      items,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save items:', error);
  }
}

export function add{Module}(item: Omit<{Module}, 'id' | 'createdAt' | 'updatedAt'>): {Module} {
  const items = get{Module}s();
  const newItem: {Module} = {
    ...item,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  items.push(newItem);
  save{Module}s(items);
  return newItem;
}

export function update{Module}(id: string, updates: Partial<Omit<{Module}, 'id' | 'createdAt'>>): {Module} | null {
  const items = get{Module}s();
  const index = items.findIndex(item => item.id === id);

  if (index === -1) return null;

  const updatedItem: {Module} = {
    ...items[index],
    ...updates,
    updatedAt: Date.now()
  };

  items[index] = updatedItem;
  save{Module}s(items);
  return updatedItem;
}

export function delete{Module}(id: string): boolean {
  const items = get{Module}s();
  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) return false;

  save{Module}s(filtered);
  return true;
}
```

### 6.2 管理后台页面模板

参考 [`src/app/admin/knowledge/page.tsx`](../../src/app/admin/knowledge/page.tsx) 的完整实现。

---

## 七、验证标准

### 7.1 功能测试

| 模块 | 测试项 | 预期结果 |
|------|--------|----------|
| 通用 | CRUD 操作 | 增删改查正常工作 |
| 通用 | 数据持久化 | 刷新页面后数据保留 |
| 通用 | 前端更新 | 后台修改后前端实时更新 |
| 通用 | 表单验证 | 必填字段验证正确 |
| 通用 | 错误处理 | localStorage 失败时显示错误 |
| 社交媒体 | 链接添加 | Footer 显示新链接 |
| 联系信息 | 信息修改 | Footer 和 Contact 页同步更新 |
| 兴趣 | 分类标签 | 正确显示分类颜色 |
| 时间线 | 日期排序 | 按日期正确排序 |
| 计划 | 进度更新 | 进度条正确显示 |
| 关于页 | 多模块 | 所有子模块正常工作 |
| 导航 | 拖拽排序 | 排序后导航栏更新 |

### 7.2 性能测试

- [ ] 首页加载时间 < 2 秒
- [ ] 切换页面无白屏
- [ ] 大数据量（100+ 条）性能可接受
- [ ] 搜索过滤响应迅速

### 7.3 兼容性测试

- [ ] Chrome 浏览器正常
- [ ] Firefox 浏览器正常
- [ ] Safari 浏览器正常
- [ ] 移动端响应式正常

### 7.4 用户体验测试

- [ ] 操作流畅无卡顿
- [ ] 反馈提示清晰
- [ ] 确认对话框合理
- [ ] 表单错误提示明显

---

## 八、风险管理

### 8.1 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| localStorage 容量限制（5-10MB） | 数据存储失败 | 使用外部 OSS 存储图片 |
| SSR 兼容性问题 | 服务端渲染错误 | 始终检查 `typeof window` |
| 数据丢失 | 用户数据清空 | 添加导出功能提示 |
| 浏览器兼容性 | 旧浏览器不支持 | 使用现代浏览器 |

### 8.2 实施风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 硬编码依赖 | 改造困难 | 先提取存储层，再修改组件 |
| UI 一致性 | 用户体验差 | 严格复用现有组件样式 |
| 时间估算不准 | 延期完成 | 分阶段验证，及时调整 |

### 8.3 注意事项

1. **代码风格一致性**: 严格按照现有代码风格编写
2. **类型安全**: 所有数据结构必须定义 TypeScript 接口
3. **错误处理**: 所有 localStorage 操作必须包含 try-catch
4. **SSR 安全**: 所有客户端代码必须检查 `typeof window`
5. **默认数据**: 所有模块必须提供合理的默认数据

---

## 附录

### A. 关键文件路径

- [`src/lib/knowledge-storage.ts`](../../src/lib/knowledge-storage.ts) - 存储层参考
- [`src/app/admin/knowledge/page.tsx`](../../src/app/admin/knowledge/page.tsx) - 管理后台参考
- [`src/components/home/KnowledgeSection.tsx`](../../src/components/home/KnowledgeSection.tsx) - 首页组件参考
- [`src/types/knowledge.ts`](../../src/types/knowledge.ts) - 类型定义参考

### B. 相关文档

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [React Hooks 文档](https://react.dev/reference/react)
- [localStorage MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### C. 实施检查清单

#### P0 阶段
- [ ] 创建 `src/types/social.ts`
- [ ] 创建 `src/types/contact.ts`
- [ ] 创建 `src/lib/social-storage.ts`
- [ ] 创建 `src/lib/contact-storage.ts`
- [ ] 修改 `src/components/layout/Footer.tsx`
- [ ] 修改 `src/app/contact/page.tsx`
- [ ] 测试社交媒体集成
- [ ] 测试联系信息集成

#### P1 阶段
- [ ] 创建 `src/types/interest.ts`
- [ ] 创建 `src/types/timeline.ts`
- [ ] 创建 `src/types/plan.ts`
- [ ] 创建 `src/lib/interest-storage.ts`
- [ ] 创建 `src/lib/timeline-storage.ts`
- [ ] 创建 `src/lib/plan-storage.ts`
- [ ] 创建 `src/app/admin/interests/page.tsx`
- [ ] 创建 `src/app/admin/timeline/page.tsx`
- [ ] 创建 `src/app/admin/plans/page.tsx`
- [ ] 修改 `src/components/home/InterestSection.tsx`
- [ ] 修改 `src/components/home/TimelineSection.tsx`
- [ ] 修改 `src/components/home/PlanSection.tsx`
- [ ] 实现 `src/app/plans/page.tsx`
- [ ] 测试所有 P1 模块

#### P2 阶段
- [ ] 创建 `src/types/personal-info.ts`
- [ ] 创建 `src/types/nav.ts`
- [ ] 创建 `src/lib/personal-storage.ts`
- [ ] 创建 `src/lib/nav-storage.ts`
- [ ] 创建 `src/app/admin/personal/page.tsx`
- [ ] 创建 `src/app/admin/navigation/page.tsx`
- [ ] 修改 `src/components/home/AboutSection.tsx`
- [ ] 修改 `src/app/about/page.tsx`
- [ ] 修改 `src/app/navbar/page.tsx`
- [ ] 修改 `src/app/admin/layout.tsx`
- [ ] 测试所有 P2 模块
- [ ] 最终端到端测试

---

**文档版本**: 1.0.0
**最后更新**: 2025-01-18
**维护者**: 开发团队
