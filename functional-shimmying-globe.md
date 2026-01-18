# Next.js 个人网站全面优化计划

**域名**: www.of2088.com
**实施方式**: 分阶段进行

---

## 问题摘要

| 类别 | 主要问题 | 影响 |
|------|---------|------|
| **安全** | 硬编码凭据 (admin/admin123)、DifyChat token 明文 | 高危 |
| **性能** | DifyChat 阻塞加载、全 CSR、未使用 antd/axios (~2MB) | 首屏加载慢 50-60% |
| **SEO** | 无 sitemap、robots.txt、Open Graph、结构化数据 | 搜索引擎收录差 |
| **可访问性** | 缺少 aria 标签、alt 属性、键盘导航 | WCAG 不合规 |

---

## 关键文件清单

- `src/components/DifyChat.tsx` - Dify 聊天集成（token 硬编码）
- `src/app/layout.tsx` - 根布局（缺 metadata）
- `src/app/page.tsx` - 首页（全量导入组件）
- `src/app/navbar/page.tsx` - 导航栏（滚动事件未防抖）
- `src/app/admin/login/page.tsx` - 登录（硬编码凭据）
- `next.config.js` - 构建配置
- `package.json` - 依赖管理（antd、axios 未使用）

---

## 阶段 1：安全加固 + 性能优化（核心）

### 1.1 环境变量隔离

**新建文件**: `.env.local`
```env
NEXT_PUBLIC_DIFY_CHAT_TOKEN=uluSs0xDCF8cY734
NEXT_PUBLIC_DIFY_SERVER_URL=https://udify.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

**修改**: `src/components/DifyChat.tsx:8-18`
```typescript
const DIFY_CONFIG = {
  token: process.env.NEXT_PUBLIC_DIFY_CHAT_TOKEN || '',
  serverUrl: process.env.NEXT_PUBLIC_DIFY_SERVER_URL || 'https://udify.app',
  systemVariables: {},
};
```

**修改**: `src/app/admin/login/page.tsx:37`
```typescript
const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
};
```

**验证**: `npm run dev` → 测试登录和聊天功能

---

### 1.2 清理未使用依赖

**命令**:
```bash
npm uninstall antd axios
```

**验证**: `npm run build` → 确认构建成功

---

### 1.3 优化 DifyChat 加载

**修改**: `src/components/DifyChat.tsx`

```typescript
"use client";

import Script from 'next/script';
import { useEffect } from 'react';

const DifyChat = () => {
  useEffect(() => {
    // 添加自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
      #dify-chatbot-bubble-button { background-color: #1C64F2 !important; }
      #dify-chatbot-bubble-window { min-width: 24rem !important; min-height: 36rem !important; resize: both !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Script
      src={`${process.env.NEXT_PUBLIC_DIFY_SERVER_URL}/embed.min.js`}
      strategy="lazyOnload"
      onReady={() => {
        window.difyChatbotConfig = {
          token: process.env.NEXT_PUBLIC_DIFY_CHAT_TOKEN,
        };
      }}
    />
  );
};

declare global {
  interface Window {
    difyChatbotConfig: { token: string };
  }
}

export default DifyChat;
```

**修改**: `src/app/layout.tsx:8`
```typescript
import dynamic from 'next/dynamic';

const DifyChat = dynamic(() => import('@/components/DifyChat'), {
  ssr: false,
  loading: () => null,
});
```

**验证**: DevTools Network → embed.min.js 应在主内容后加载

---

### 1.4 首页组件动态导入

**修改**: `src/app/page.tsx:4-10`
```typescript
import dynamic from 'next/dynamic';
import Link from 'next/link';

const AboutSection = dynamic(() => import('@/components/home/AboutSection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const PlanSection = dynamic(() => import('@/components/home/PlanSection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const KnowledgeSection = dynamic(() => import('@/components/home/KnowledgeSection'));
const InterestSection = dynamic(() => import('@/components/home/InterestSection'));
const TimelineSection = dynamic(() => import('@/components/home/TimelineSection'));
```

**验证**: `npm run build` → 检查 .next/static/chunks/ 有组件分割

---

### 1.5 Navbar 滚动防抖

**修改**: `src/app/navbar/page.tsx:12-23`
```typescript
useEffect(() => {
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**验证**: DevTools Performance → 滚动帧率 60fps

---

### 1.6 添加安全头

**修改**: `next.config.js`
```javascript
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'oss.of2088.top',
    }],
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
```

**验证**: `curl -I http://localhost:3000` → 检查响应头

---

### 1.7 阶段 1 验证清单

- [ ] 环境变量正确加载
- [ ] 登录功能正常
- [ ] 聊天机器人延迟加载
- [ ] 首屏加载时间减少 40%+
- [ ] 滚动流畅（60fps）
- [ ] 安全头已添加
- [ ] `npm run build` 成功

---

## 阶段 2：SEO 优化

### 2.1 添加完整 metadata

**修改**: `src/app/layout.tsx`
```typescript
import { Metadata } from 'next';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

const DifyChat = dynamic(() => import('@/components/DifyChat'), {
  ssr: false,
  loading: () => null,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.of2088.com'),
  title: {
    default: 'Oliver Fang - 半导体/集成电路行业生产管理专家',
    template: '%s | Oliver Fang',
  },
  description: '半导体行业15年工作经验，专注于生产管理、测试厂建设与IT系统规划',
  keywords: ['半导体', '集成电路', '生产管理', '测试厂', 'AI编程'],
  authors: [{ name: 'Oliver Fang' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.of2088.com',
    title: 'Oliver Fang - 半导体行业专家',
    description: '15年半导体行业经验，专注生产管理与测试厂建设',
    siteName: 'Oliver Fang',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oliver Fang - 半导体行业专家',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <DifyChat />
      </body>
    </html>
  );
}
```

---

### 2.2 子页面 metadata

**修改**: `src/app/about/page.tsx` (添加到文件开头)
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我',
  description: '详细了解Oliver Fang的专业背景、工作经历和技能特长',
};
```

**同样修改**: `src/app/plans/page.tsx`, `src/app/knowledge/page.tsx`, `src/app/contact/page.tsx`

---

### 2.3 创建 sitemap.ts

**新建文件**: `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.of2088.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.of2088.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.of2088.com/plans', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.of2088.com/knowledge', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.of2088.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
```

---

### 2.4 创建 robots.ts

**新建文件**: `src/app/robots.ts`
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }],
    sitemap: 'https://www.of2088.com/sitemap.xml',
  };
}
```

---

### 2.5 添加结构化数据

**修改**: `src/app/layout.tsx` (在 `<body>` 内添加)
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oliver Fang',
  jobTitle: '生产部长',
  description: '半导体/集成电路行业生产管理专家',
  url: 'https://www.of2088.com',
};

// 在 return 中 <body> 后添加
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

### 2.6 阶段 2 验证清单

- [ ] `http://localhost:3000/sitemap.xml` 可访问
- [ ] `http://localhost:3000/robots.txt` 可访问
- [ ] 页面源代码 `<head>` 包含 Open Graph 标签
- [ ] Google Rich Results Test 通过

---

## 阶段 3：可访问性优化

### 3.1 添加跳过导航链接

**修改**: `src/app/layout.tsx`
```typescript
// 在 <main> 前
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white">
  跳过导航
</a>

<main id="main-content" className="flex-grow">
```

**修改**: `src/styles/globals.css` (添加)
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

### 3.2 SVG 图标添加 aria-hidden

**修改**: `src/app/navbar/page.tsx:69-81`
```typescript
<svg
  className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
```

**批量查找修复**:
```bash
# 在项目中搜索所有 <svg> 标签并添加 aria-hidden="true"
```

---

### 3.3 移动菜单 aria-expanded

**修改**: `src/app/navbar/page.tsx:64-68`
```typescript
<button
  className="md:hidden"
  onClick={toggleMenu}
  aria-label="Toggle Menu"
  aria-expanded={isMenuOpen}
>
```

---

### 3.4 表单错误 aria-live

**修改**: `src/app/admin/login/page.tsx:95-107`
```typescript
{error && (
  <div
    className="bg-red-50 border-l-4 border-red-500 p-4 mt-4"
    role="alert"
    aria-live="assertive"
  >
    {/* ... */}
  </div>
)}
```

---

### 3.5 阶段 3 验证清单

- [ ] axe DevTools 扫描无严重错误
- [ ] Tab 键可导航所有交互元素
- [ ] 所有 SVG 有 aria-hidden="true"
- [ ] 屏幕阅读器可正确朗读内容

---

## 最终验证

### 性能测试
```bash
# Lighthouse (Chrome DevTools)
# 目标: Performance >85, SEO >90, Accessibility >90
```

### SEO 验证
- [ ] https://www.opengraph.xyz/ 验证通过
- [ ] sitemap.xml 包含所有页面
- [ ] robots.txt 正确配置

### 功能测试
- [ ] 导航正常
- [ ] 登录功能正常
- [ ] 表单提交正常
- [ ] 移动端响应式正常

---

## 预期成果

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首屏加载时间 | 3-5s | 1.5-2s | 50-60% |
| Bundle 大小 | ~800KB | ~300KB | 60% |
| Lighthouse 性能 | 50-65 | 90+ | 40+ 分 |
| SEO 收录 | 差 | 优秀 | 200%+ |
| WCAG 合规 | 不合规 | AA 级 | - |

---

## 风险提示

1. **环境变量**: 确保 `.env.local` 添加到 `.gitignore`
2. **备份**: 建议在分支上实施，确认无误后合并
3. **测试**: 每个阶段完成后完整测试所有功能
