# 渐进式网站升级实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将个人网站从 localStorage 迁移到 SQLite 数据库，完善四大内容板块，强化半导体视觉元素，添加图片管理功能。

**架构:** 保持现有 Next.js 14 + React 18 架构，引入 Prisma ORM + SQLite 数据库，逐步替换 localStorage 存储层，保留现有组件结构。

**Tech Stack:** Prisma 5.x, SQLite 3, next-api-routes, react-dropzone, sharp (图片处理)

---

## Phase 1: 数据库基础设施 (Day 1-2)

### Task 1: 安装和配置 Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Modify: `package.json`
- Create: `.env`

**Step 1: 安装 Prisma 依赖**

```bash
npm install prisma @prisma/client --save-exact
npm install -D prisma
```

**Step 2: 初始化 Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

**Step 3: 配置 schema.prisma**

创建 `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============= 核心实体模型 =============

model TimelineItem {
  id        String   @id @default(cuid())
  title     String
  date      String
  content   String
  likes     Int      @default(0)
  comments  Int      @default(0)
  category  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Article {
  id          String   @id @default(cuid())
  title       String
  excerpt     String
  content     String
  category    String
  type        String   // 'free' | 'paid'
  readTime    Int?
  price       Int?
  publishDate String
  features    String?  // JSON array
  chapters    String?  // JSON array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Plan {
  id          String   @id @default(cuid())
  title       String
  description String
  progress    Int      @default(0)
  category    String
  status      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Skill {
  id        String   @id @default(cuid())
  name      String
  level     Int
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Experience {
  id          String   @id @default(cuid())
  title       String
  company     String
  period      String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Education {
  id          String   @id @default(cuid())
  degree      String
  school      String
  period      String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Interest {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  icon        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model NavItem {
  id        String   @id @default(cuid())
  label     String
  href      String
  order     Int
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SectionConfig {
  id          String   @id @default(cuid())
  sectionId   String   @unique // 'about', 'plans', 'knowledge'...
  name        String
  visible     Boolean  @default(true)
  order       Int
  component   String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PageContent {
  id        String   @id @default(cuid())
  page      String   @unique // 'about', 'plans', 'knowledge'...
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SocialLink {
  id        String   @id @default(cuid())
  platform  String
  url       String
  icon      String
  visible   Boolean  @default(true)
  order     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactInfo {
  id        String   @id @default(cuid())
  phone     String?
  email     String?
  address   String?
  wechat    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Message {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  content   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Image {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  mimeType    String
  size        Int
  width       Int?
  height      Int?
  url         String   // /uploads/images/xxx.jpg
  category    String?  // 'timeline', 'article', 'avatar'...
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Step 4: 配置 .env**

创建 `.env`:

```env
DATABASE_URL="file:./dev.db"
```

**Step 5: 生成 Prisma Client**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

**Step 6: 提交**

```bash
git add prisma .env package.json package-lock.json
git commit -m "feat: 添加 Prisma + SQLite 数据库配置"
```

---

### Task 2: 创建数据库工具和 API 路由

**Files:**
- Create: `src/lib/prisma.ts`
- Create: `src/app/api/timeline/route.ts`
- Create: `src/app/api/articles/route.ts`
- Create: `src/app/api/plans/route.ts`
- Create: `src/app/api/about/route.ts`

**Step 1: 创建 Prisma 客户端单例**

创建 `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Step 2: 创建 Timeline API**

创建 `src/app/api/timeline/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/timeline - 获取所有时间线项目
export async function GET() {
  try {
    const items = await prisma.timelineItem.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

// POST /api/timeline - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await prisma.timelineItem.create({
      data: {
        title: data.title,
        date: data.date,
        content: data.content,
        category: data.category,
        likes: 0,
        comments: 0
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create timeline item' }, { status: 500 });
  }
}

// PUT /api/timeline - 更新项目
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await prisma.timelineItem.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date,
        content: data.content,
        category: data.category
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline item' }, { status: 500 });
  }
}

// DELETE /api/timeline - 删除项目
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.timelineItem.delete({
      where: { id: id! }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timeline item' }, { status: 500 });
  }
}
```

**Step 3: 创建 Articles API**

创建 `src/app/api/articles/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishDate: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const article = await prisma.article.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        type: data.type,
        readTime: data.readTime,
        price: data.price,
        publishDate: data.publishDate,
        features: data.features ? JSON.stringify(data.features) : null,
        chapters: data.chapters ? JSON.stringify(data.chapters) : null
      }
    });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
```

**Step 4: 创建 Plans API**

创建 `src/app/api/plans/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.plan.findMany();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const plan = await prisma.plan.create({
      data: {
        title: data.title,
        description: data.description,
        progress: data.progress || 0,
        category: data.category,
        status: data.status
      }
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
```

**Step 5: 创建 About API (技能/经历/教育)**

创建 `src/app/api/about/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/about?type=skills|experiences|educations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data;
    switch (type) {
      case 'skills':
        data = await prisma.skill.findMany();
        break;
      case 'experiences':
        data = await prisma.experience.findMany({
          orderBy: { period: 'desc' }
        });
        break;
      case 'educations':
        data = await prisma.education.findMany({
          orderBy: { period: 'desc' }
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST /api/about - 创建/更新
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, ...itemData } = data;

    let result;
    switch (type) {
      case 'skills':
        result = await prisma.skill.create({ data: itemData });
        break;
      case 'experiences':
        result = await prisma.experience.create({ data: itemData });
        break;
      case 'educations':
        result = await prisma.education.create({ data: itemData });
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
```

**Step 6: 提交**

```bash
git add src/lib/prisma.ts src/app/api
git commit -m "feat: 添加数据库 API 路由 (timeline, articles, plans, about)"
```

---

## Phase 2: 数据迁移工具 (Day 2)

### Task 3: 创建数据迁移脚本

**Files:**
- Create: `scripts/migrate-data.ts`
- Modify: `package.json`

**Step 1: 安装 ts-node**

```bash
npm install -D ts-node @types/node
```

**Step 2: 创建迁移脚本**

创建 `scripts/migrate-data.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// 读取 localStorage 数据的模拟文件
const MOCK_DATA_DIR = path.join(process.cwd(), 'scripts', 'mock-data');

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  category?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  type: 'free' | 'paid';
  readTime?: number;
  price?: number;
  publishDate: string;
  features?: string[];
  chapters?: any[];
  createdAt: number;
  updatedAt: number;
}

// 读取现有 localStorage 数据（手动导出的 JSON）
function loadLocalData() {
  const dataPath = path.join(MOCK_DATA_DIR, 'localstorage-data.json');

  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  未找到导出数据，创建空模板');
    fs.mkdirSync(MOCK_DATA_DIR, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify({
      timeline_items: [],
      knowledge_articles: [],
      plans: [],
      about_skills: [],
      about_experiences: [],
      about_educations: [],
      interests: [],
      nav_items: [],
      home_sections_config: []
    }, null, 2));
    return null;
  }

  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

async function migrateTimeline(data: any[]) {
  console.log('📅 迁移时间线数据...');
  for (const item of data) {
    await prisma.timelineItem.create({
      data: {
        id: item.id,
        title: item.title,
        date: item.date,
        content: item.content,
        likes: item.likes || 0,
        comments: item.comments || 0,
        category: item.category
      }
    });
  }
  console.log(`✅ 迁移 ${data.length} 条时间线数据`);
}

async function migrateArticles(data: Article[]) {
  console.log('📚 迁移知识库数据...');
  for (const item of data) {
    await prisma.article.create({
      data: {
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        type: item.type,
        readTime: item.readTime,
        price: item.price,
        publishDate: item.publishDate,
        features: item.features ? JSON.stringify(item.features) : null,
        chapters: item.chapters ? JSON.stringify(item.chapters) : null
      }
    });
  }
  console.log(`✅ 迁移 ${data.length} 篇文章`);
}

async function migratePlans(data: any[]) {
  console.log('🎯 迁移计划数据...');
  for (const item of data) {
    await prisma.plan.create({
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        progress: item.progress || 0,
        category: item.category,
        status: item.status
      }
    });
  }
  console.log(`✅ 迁移 ${data.length} 个计划`);
}

async function migrateAbout(skills: any[], experiences: any[], educations: any[]) {
  console.log('👤 迁移关于页面数据...');

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: skill.category
      }
    });
  }
  console.log(`✅ 迁移 ${skills.length} 个技能`);

  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        id: exp.id,
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description
      }
    });
  }
  console.log(`✅ 迁移 ${experiences.length} 段经历`);

  for (const edu of educations) {
    await prisma.education.create({
      data: {
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        period: edu.period,
        description: edu.description
      }
    });
  }
  console.log(`✅ 迁移 ${educations.length} 个教育经历`);
}

async function main() {
  const data = loadLocalData();

  if (!data) {
    console.log('⚠️  请先在浏览器控制台导出 localStorage 数据到 scripts/mock-data/localstorage-data.json');
    console.log('💾 导出命令: copy(JSON.stringify(localStorage), clipboard)');
    return;
  }

  // 清空现有数据
  console.log('🗑️  清空现有数据...');
  await prisma.timelineItem.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});

  // 迁移数据
  await migrateTimeline(data.timeline_items || []);
  await migrateArticles(data.knowledge_articles || []);
  await migratePlans(data.plans || []);
  await migrateAbout(
    data.about_skills || [],
    data.about_experiences || [],
    data.about_educations || []
  );

  console.log('🎉 数据迁移完成！');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Step 3: 添加 npm script**

修改 `package.json`, 添加到 scripts:

```json
"scripts": {
  "migrate:data": "ts-node scripts/migrate-data.ts"
}
```

**Step 4: 提交**

```bash
git add scripts package.json
git commit -m "feat: 添加数据迁移脚本"
```

---

## Phase 3: 更新组件使用数据库 API (Day 3-4)

### Task 4: 更新 TimelineSection 组件

**Files:**
- Modify: `src/components/home/TimelineSection.tsx`
- Create: `src/lib/api-client.ts`

**Step 1: 创建 API 客户端工具**

创建 `src/lib/api-client.ts`:

```typescript
const API_BASE = '/api';

export const api = {
  timeline: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/timeline`);
      if (!res.ok) throw new Error('Failed to fetch timeline');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create timeline item');
      return res.json();
    },
    update: async (data: any) => {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update timeline item');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/timeline?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete timeline item');
      return res.json();
    }
  },

  articles: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/articles`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create article');
      return res.json();
    }
  },

  plans: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/plans`);
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create plan');
      return res.json();
    }
  },

  about: {
    get: async (type: 'skills' | 'experiences' | 'educations') => {
      const res = await fetch(`${API_BASE}/about?type=${type}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    },
    create: async (type: string, data: any) => {
      const res = await fetch(`${API_BASE}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    }
  }
};
```

**Step 2: 更新 TimelineSection 组件**

修改 `src/components/home/TimelineSection.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { TimelineItem } from '@/types/timeline';

export default function TimelineSection() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.timeline.getAll()
      .then(data => {
        setItems(data.slice(0, 3)); // 显示前3条
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load timeline:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="animate-pulse">加载中...</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* 保持原有组件结构，数据源从 API 获取 */}
        {/* ... 现有渲染代码 ... */}
      </div>
    </section>
  );
}
```

**Step 3: 更新 KnowledgeSection 组件**

修改 `src/components/home/KnowledgeSection.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function KnowledgeSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.articles.getAll()
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles:', err);
        setLoading(false);
      });
  }, []);

  // ... 保持原有渲染逻辑
}
```

**Step 4: 更新 PlanSection 组件**

修改 `src/components/home/PlanSection.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function PlanSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.plans.getAll()
      .then(data => {
        setPlans(data);
        setLoading(false);
      });
  }, []);

  // ... 保持原有渲染逻辑
}
```

**Step 5: 提交**

```bash
git add src/lib/api-client.ts src/components/home
git commit -m "feat: 更新首页组件使用数据库 API"
```

---

### Task 5: 更新管理后台页面

**Files:**
- Modify: `src/app/admin/timeline/page.tsx`
- Modify: `src/app/admin/knowledge/page.tsx`
- Modify: `src/app/admin/plans/page.tsx`
- Modify: `src/app/admin/about/page.tsx`

**Step 1: 更新 Timeline 管理页面**

修改 `src/app/admin/timeline/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function TimelineAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const data = await api.timeline.getAll();
    setItems(data);
    setLoading(false);
  };

  const handleCreate = async (values: any) => {
    await api.timeline.create(values);
    refreshData();
  };

  const handleUpdate = async (values: any) => {
    await api.timeline.update(values);
    refreshData();
  };

  const handleDelete = async (id: string) => {
    await api.timeline.delete(id);
    refreshData();
  };

  // ... 保持原有 UI 逻辑
}
```

**Step 2: 同样方式更新其他管理页面**

- `src/app/admin/knowledge/page.tsx` 使用 `api.articles`
- `src/app/admin/plans/page.tsx` 使用 `api.plans`
- `src/app/admin/about/page.tsx` 使用 `api.about`

**Step 3: 提交**

```bash
git add src/app/admin
git commit -m "feat: 更新管理后台使用数据库 API"
```

---

## Phase 4: 图片上传和管理功能 (Day 5)

### Task 6: 实现图片上传功能

**Files:**
- Create: `src/app/api/images/route.ts`
- Create: `src/components/admin/ImageUploader.tsx`
- Create: `public/uploads/.gitkeep`
- Modify: `next.config.js`

**Step 1: 配置 Next.js 允许更大请求体**

修改 `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oss.of2088.top', 'localhost'],
    unoptimized: true
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

module.exports = nextConfig;
```

**Step 2: 创建图片上传 API**

创建 `src/app/api/images/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// POST /api/images - 上传图片
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 创建 uploads 目录
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    await mkdir(uploadsDir, { recursive: true });

    // 生成唯一文件名
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${random}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // 保存到数据库
    const image = await prisma.image.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/images/${filename}`,
        category
      }
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// GET /api/images - 获取图片列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const images = await prisma.image.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// DELETE /api/images - 删除图片
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const image = await prisma.image.findUnique({ where: { id: id! } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 删除文件
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'images', image.filename);
    const fs = await import('fs/promises');
    await fs.unlink(filepath).catch(() => {});

    // 删除数据库记录
    await prisma.image.delete({ where: { id: id! } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
```

**Step 3: 创建图片上传组件**

创建 `src/components/admin/ImageUploader.tsx`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface ImageUploaderProps {
  category?: string;
  onUploadSuccess?: (url: string) => void;
}

export default function ImageUploader({ category = 'general', onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      message.success('上传成功');
      onUploadSuccess?.(data.url);
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      handleUpload(file);
      return false;
    }
  };

  return (
    <Dragger {...uploadProps} style={{ cursor: uploading ? 'wait' : 'pointer' }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
      <p className="ant-upload-hint">支持 JPG、PNG、GIF、WebP 格式，最大 10MB</p>
    </Dragger>
  );
}
```

**Step 4: 创建上传目录**

```bash
mkdir -p public/uploads/images
```

**Step 5: 提交**

```bash
git add src/app/api/images src/components/admin/ImageUploader.tsx public/uploads next.config.js
git commit -m "feat: 添加图片上传和管理功能"
```

---

### Task 7: 为各板块添加图片上传

**Files:**
- Modify: `src/app/admin/timeline/page.tsx`
- Modify: `src/app/admin/knowledge/page.tsx`

**Step 1: 更新 Timeline 管理页面支持图片**

在 Timeline 表单中添加图片选择器：

```typescript
import ImageUploader from '@/components/admin/ImageUploader';

// 在表单中添加
<Form.Item label="配图">
  <ImageUploader
    category="timeline"
    onUploadSuccess={(url) => form.setFieldsValue({ image: url })}
  />
  {imageUrl && <img src={imageUrl} alt="preview" style={{ maxWidth: 200, marginTop: 10 }} />}
</Form.Item>
```

**Step 2: 同样方式更新 Knowledge 管理页面**

**Step 3: 提交**

```bash
git add src/app/admin
git commit -m "feat: 为管理页面添加图片上传功能"
```

---

## Phase 5: 强化半导体视觉元素 (Day 6)

### Task 8: 增强芯片和电路动画效果

**Files:**
- Create: `src/components/patterns/EnhancedChip.tsx`
- Create: `src/components/patterns/AnimatedCircuit.tsx`
- Create: `src/components/patterns/DataFlowParticles.tsx`
- Modify: `src/app/page.tsx`

**Step 1: 创建增强版芯片组件**

创建 `src/components/patterns/EnhancedChip.tsx`:

```typescript
'use client';

import React from 'react';

interface EnhancedChipProps {
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
  rotating?: boolean;
}

export default function EnhancedChip({
  size = 'md',
  glowing = true,
  rotating = false
}: EnhancedChipProps) {
  const sizes = {
    sm: { width: 60, height: 60, pins: 8 },
    md: { width: 120, height: 120, pins: 12 },
    lg: { width: 180, height: 180, pins: 16 }
  };

  const { width, height, pins } = sizes[size];
  const pinLength = size === 'lg' ? 20 : 15;

  return (
    <div
      className={`inline-block ${rotating ? 'animate-spin-slow' : ''}`}
      style={{ animationDuration: '20s' }}
    >
      <svg width={width + pinLength * 2} height={height + pinLength * 2} viewBox={`0 0 ${width + pinLength * 2} ${height + pinLength * 2}`}>
        <defs>
          <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 上方引脚 */}
        {[...Array(pins)].map((_, i) => {
          const x = pinLength + (width / (pins + 1)) * (i + 1);
          return (
            <g key={`top-${i}`}>
              <line
                x1={x} y1={0} x2={x} y2={pinLength}
                stroke="#d4a853"
                strokeWidth="2"
                className={glowing ? 'animate-pulse' : ''}
              />
              <circle cx={x} cy={0} r="2" fill="#d4a853" />
            </g>
          );
        })}

        {/* 下方引脚 */}
        {[...Array(pins)].map((_, i) => {
          const x = pinLength + (width / (pins + 1)) * (i + 1);
          const y = pinLength + height;
          return (
            <g key={`bottom-${i}`}>
              <line
                x1={x} y1={y} x2={x} y2={y + pinLength}
                stroke="#d4a853"
                strokeWidth="2"
                className={glowing ? 'animate-pulse' : ''}
              />
              <circle cx={x} cy={y + pinLength} r="2" fill="#d4a853" />
            </g>
          );
        })}

        {/* 左侧引脚 */}
        {[...Array(pins)].map((_, i) => {
          const y = pinLength + (height / (pins + 1)) * (i + 1);
          return (
            <g key={`left-${i}`}>
              <line
                x1={0} y1={y} x2={pinLength} y2={y}
                stroke="#d4a853"
                strokeWidth="2"
                className={glowing ? 'animate-pulse' : ''}
              />
              <circle cx={0} cy={y} r="2" fill="#d4a853" />
            </g>
          );
        })}

        {/* 右侧引脚 */}
        {[...Array(pins)].map((_, i) => {
          const y = pinLength + (height / (pins + 1)) * (i + 1);
          const x = pinLength + width;
          return (
            <g key={`right-${i}`}>
              <line
                x1={x} y1={y} x2={x + pinLength} y2={y}
                stroke="#d4a853"
                strokeWidth="2"
                className={glowing ? 'animate-pulse' : ''}
              />
              <circle cx={x + pinLength} cy={y} r="2" fill="#d4a853" />
            </g>
          );
        })}

        {/* 芯片主体 */}
        <rect
          x={pinLength}
          y={pinLength}
          width={width}
          height={height}
          fill="url(#chipGradient)"
          stroke="#00C2FF"
          strokeWidth="2"
          rx="4"
          filter={glowing ? 'url(#glow)' : undefined}
          className={glowing ? 'animate-pulse' : ''}
        />

        {/* 芯片内部电路纹理 */}
        <g opacity="0.3">
          {[...Array(3)].map((_, i) => (
            <line
              key={i}
              x1={pinLength + 10}
              y1={pinLength + (height / 4) * (i + 1)}
              x2={pinLength + width - 10}
              y2={pinLength + (height / 4) * (i + 1)}
              stroke="#00C2FF"
              strokeWidth="1"
            />
          ))}
          {[...Array(4)].map((_, i) => (
            <line
              key={i}
              x1={pinLength + (width / 5) * (i + 1)}
              y1={pinLength + 10}
              x2={pinLength + (width / 5) * (i + 1)}
              y2={pinLength + height - 10}
              stroke="#00C2FF"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* 芯片中心 Logo */}
        <circle
          cx={pinLength + width / 2}
          cy={pinLength + height / 2}
          r={width / 6}
          fill="none"
          stroke="#00C2FF"
          strokeWidth="2"
          className={glowing ? 'animate-pulse' : ''}
        />
      </svg>
    </div>
  );
}
```

**Step 2: 创建动态电路板背景**

创建 `src/components/patterns/AnimatedCircuit.tsx`:

```typescript
'use client';

import React, { useEffect, useRef } from 'react';

interface CircuitPath {
  d: string;
  delay: number;
}

export default function AnimatedCircuit() {
  const svgRef = useRef<SVGSVGElement>(null);

  const paths: CircuitPath[] = [
    { d: 'M 0 50 L 200 50 L 250 100 L 400 100', delay: 0 },
    { d: 'M 0 150 L 150 150 L 200 200 L 350 200', delay: 0.5 },
    { d: 'M 0 250 L 100 250 L 150 300 L 300 300', delay: 1 },
    { d: 'M 500 0 L 500 100 L 450 150 L 300 150', delay: 1.5 },
    { d: 'M 600 50 L 750 50 L 800 100 L 900 100', delay: 2 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0" />
            <stop offset="50%" stopColor="#00C2FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#0066CC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {paths.map((path, i) => (
          <g key={i}>
            {/* 电路轨迹 */}
            <path
              d={path.d}
              stroke="#1e3a5f"
              strokeWidth="3"
              fill="none"
            />

            {/* 流动光效 */}
            <path
              d={path.d}
              stroke="url(#circuitGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 10"
              className="animate-flow"
              style={{
                animationDelay: `${path.delay}s`,
                animationDuration: '3s'
              }}
            />
          </g>
        ))}

        {/* 电路节点 */}
        {[50, 150, 250, 350, 450, 550, 650, 750, 850].map((x, i) => (
          <circle
            key={i}
            cx={x % 200 + 100}
            cy={Math.floor(x / 200) * 100 + 50}
            r="4"
            fill="#00C2FF"
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  );
}
```

**Step 3: 创建数据流动粒子效果**

创建 `src/components/patterns/DataFlowParticles.tsx`:

```typescript
'use client';

import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export default function DataFlowParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 2
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400 animate-particle-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            boxShadow: '0 0 10px #00C2FF, 0 0 20px #00C2FF'
          }}
        />
      ))}
    </div>
  );
}
```

**Step 4: 添加自定义动画到 globals.css**

修改 `src/styles/globals.css`, 添加:

```css
/* 芯片和电路动画 */
@keyframes flow {
  0% {
    stroke-dashoffset: 20;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-flow {
  animation: flow 2s linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(100px, -200px) scale(0);
    opacity: 0;
  }
}

.animate-particle-float {
  animation: particle-float 10s linear infinite;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
```

**Step 5: 更新首页使用新组件**

修改 `src/app/page.tsx`, 添加新组件到英雄区域:

```typescript
import AnimatedCircuit from '@/components/patterns/AnimatedCircuit';
import DataFlowParticles from '@/components/patterns/DataFlowParticles';
import EnhancedChip from '@/components/patterns/EnhancedChip';

// 在英雄区域的背景中添加
<div className="relative">
  <AnimatedCircuit />
  <DataFlowParticles />

  <div className="absolute top-10 right-10 opacity-30">
    <EnhancedChip size="lg" glowing rotating />
  </div>

  {/* 现有内容 */}
</div>
```

**Step 6: 提交**

```bash
git add src/components/patterns src/app/page.tsx src/styles/globals.css
git commit -m "feat: 添加增强版半导体视觉元素（芯片、电路、粒子）"
```

---

## Phase 6: 完善内容板块 (Day 7-8)

### Task 9: 创建行业项目成果板块

**Files:**
- Create: `src/components/home/ProjectsSection.tsx`
- Create: `src/types/project.ts`
- Create: `src/app/api/projects/route.ts`
- Modify: `prisma/schema.prisma`

**Step 1: 更新 Prisma Schema**

修改 `prisma/schema.prisma`, 添加 Project 模型:

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  role        String   // "项目负责人", "技术负责人"
  company     String
  period      String   // "2020-2023"
  achievements String  // JSON array of achievements
  metrics     String?  // JSON: { "yield": "95%", "capacity": "10k/月" }
  images      String?  // JSON array of image URLs
  tags        String   // JSON array
  visible     Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Step 2: 运行迁移**

```bash
npx prisma migrate dev --name add_projects
```

**Step 3: 创建项目类型**

创建 `src/types/project.ts`:

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  company: string;
  period: string;
  achievements: string[];
  metrics?: {
    yield?: string;
    capacity?: string;
    cost?: string;
    efficiency?: string;
  };
  images?: string[];
  tags: string[];
  visible: boolean;
  order: number;
}
```

**Step 4: 创建 Projects API**

创建 `src/app/api/projects/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(
      projects.map(p => ({
        ...p,
        achievements: JSON.parse(p.achievements),
        metrics: p.metrics ? JSON.parse(p.metrics) : undefined,
        images: p.images ? JSON.parse(p.images) : [],
        tags: JSON.parse(p.tags)
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        role: data.role,
        company: data.company,
        period: data.period,
        achievements: JSON.stringify(data.achievements || []),
        metrics: data.metrics ? JSON.stringify(data.metrics) : null,
        images: data.images ? JSON.stringify(data.images) : null,
        tags: JSON.stringify(data.tags || []),
        visible: data.visible !== false,
        order: data.order || 0
      }
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
```

**Step 5: 创建 ProjectsSection 组件**

创建 `src/components/home/ProjectsSection.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Project } from '@/types/project';
import { api } from '@/lib/api-client';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-circuit-pattern" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-cyan-400">行业项目</span>成果展示
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            15年半导体封测行业经验，主导建设车规级芯片测试工厂
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover-glow"
            >
              {/* 芯片装饰 */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <rect x="8" y="8" width="24" height="24" fill="#1e3a5f" stroke="#00C2FF" strokeWidth="1" rx="2" />
                </svg>
              </div>

              {/* 标签 */}
              <div className="flex gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full border border-cyan-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 标题和角色 */}
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-cyan-400 mb-4">{project.role}</p>

              {/* 公司和周期 */}
              <div className="flex gap-6 text-slate-400 mb-4 text-sm">
                <span>{project.company}</span>
                <span>{project.period}</span>
              </div>

              {/* 描述 */}
              <p className="text-slate-300 mb-6">{project.description}</p>

              {/* 成就列表 */}
              <ul className="space-y-2 mb-6">
                {project.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-400 mt-1">▸</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* 关键指标 */}
              {project.metrics && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{value}</div>
                      <div className="text-xs text-slate-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 图片 */}
              {project.images && project.images.length > 0 && (
                <div className="mt-6 flex gap-2 overflow-x-auto">
                  {project.images.map((img, i) => (
                    <div key={i} className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 6: 更新首页板块配置**

修改 SectionConfig 类型，添加 'projects':

```typescript
// src/types/section-config.ts
export type SectionId = 'about' | 'plans' | 'knowledge' | 'timeline' | 'interests' | 'projects';
```

**Step 7: 提交**

```bash
git add prisma src/types src/app/api/projects src/components/home/ProjectsSection.tsx
git commit -m "feat: 添加行业项目成果板块"
```

---

### Task 10: 创建职业发展轨迹板块

**Files:**
- Create: `src/components/home/CareerPathSection.tsx`
- Modify: `src/app/about/page.tsx`

**Step 1: 创建职业发展轨迹组件**

创建 `src/components/home/CareerPathSection.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import type { Experience } from '@/types/about';
import { api } from '@/lib/api-client';

export default function CareerPathSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.about.get('experiences').then(data => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-cyan-400">职业发展</span>轨迹
          </h2>
          <p className="text-slate-400">从技术员到生产部长的成长之路</p>
        </div>

        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-20">
                {/* 节点 */}
                <div className="absolute left-6 w-5 h-5 bg-slate-900 border-2 border-cyan-400 rounded-full" />

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full">
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                  <p className="text-cyan-400 mb-3">{exp.company}</p>

                  <p className="text-slate-300">{exp.description}</p>

                  {/* 技能标签 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技能雷达图 */}
        <div className="mt-16 bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">核心技能</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {['生产管理', '质量体系', '工艺工程'].map((category) => (
              <div key={category} className="text-center">
                <div className="text-cyan-400 font-bold mb-2">{category}</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: 提交**

```bash
git add src/components/home/CareerPathSection.tsx
git commit -m "feat: 添加职业发展轨迹板块"
```

---

### Task 11: 创建个人生活展示板块

**Files:**
- Create: `src/components/home/LifeSection.tsx`

**Step 1: 创建个人生活板块组件**

创建 `src/components/home/LifeSection.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Interest } from '@/types/interest';

export default function LifeSection() {
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    // 从 API 获取兴趣数据
    fetch('/api/interests')
      .then(res => res.json())
      .then(data => setInterests(data));
  }, []);

  const lifeCategories = [
    { id: 'reading', icon: '📚', title: '阅读' },
    { id: 'tech', icon: '💻', title: '技术探索' },
    { id: 'outdoor', icon: '🏔️', title: '户外运动' },
    { id: 'photography', icon: '📷', title: '摄影' }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="text-cyan-400">生活</span>不止工作
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            在半导体行业之外，我也是一个热爱生活的人
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lifeCategories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-500/30 transition-all text-center hover-glow"
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
              <p className="text-slate-400 text-sm">
                {interests.filter(i => i.category === cat.id).map(i => i.name).join('、') || cat.title}
              </p>
            </div>
          ))}
        </div>

        {/* 个人照片展示 */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">生活瞬间</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group cursor-pointer"
              >
                <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                  📷 照片 {i}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 个人理念 */}
        <div className="mt-12 text-center">
          <blockquote className="text-xl text-slate-300 italic max-w-3xl mx-auto">
            "在精密的芯片世界里，我学会了追求完美的耐心；<br />
            在广阔的生活天地中，我保持着探索未知的热情。"
          </blockquote>
          <p className="text-cyan-400 mt-4">— Oliver</p>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: 提交**

```bash
git add src/components/home/LifeSection.tsx
git commit -m "feat: 添加个人生活展示板块"
```

---

## Phase 7: 管理后台项目页面 (Day 9)

### Task 12: 创建项目管理后台

**Files:**
- Create: `src/app/admin/projects/page.tsx`

**Step 1: 创建项目管理页面**

创建 `src/app/admin/projects/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      achievements: project.achievements.join('\n'),
      tags: project.tags.join(','),
      metrics: project.metrics ? JSON.stringify(project.metrics, null, 2) : ''
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个项目吗？',
      onOk: async () => {
        await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        message.success('删除成功');
        fetchProjects();
      }
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      achievements: values.achievements.split('\n').filter(Boolean),
      tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
      metrics: values.metrics ? JSON.parse(values.metrics) : undefined
    };

    if (editingProject) {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editingProject.id })
      });
      message.success('更新成功');
    } else {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      message.success('创建成功');
    }

    setModalVisible(false);
    fetchProjects();
  };

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '公司', dataIndex: 'company', key: 'company' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '周期', dataIndex: 'period', key: 'period' },
    { title: '排序', dataIndex: 'order', key: 'order' },
    { title: '显示', dataIndex: 'visible', key: 'visible', render: (v: boolean) => (v ? '✓' : '✗') },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          添加项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProject ? '编辑项目' : '添加项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="项目标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="公司" name="company" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="周期" name="period" rules={[{ required: true }]}>
            <Input placeholder="2020-2023" />
          </Form.Item>

          <Form.Item label="描述" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="成就（每行一个）" name="achievements">
            <Input.TextArea rows={4} placeholder="完成工厂建设&#10;通过客户审核" />
          </Form.Item>

          <Form.Item label="关键指标（JSON格式）" name="metrics">
            <Input.TextArea rows={3} placeholder='{"yield": "95%", "capacity": "10k/月"}' />
          </Form.Item>

          <Form.Item label="标签（逗号分隔）" name="tags">
            <Input placeholder="封测, 车规级, 量产" />
          </Form.Item>

          <Form.Item label="配图" name="images">
            <ImageUploader category="project" />
          </Form.Item>

          <Form.Item label="排序" name="order" initialValue={0}>
            <InputNumber />
          </Form.Item>

          <Form.Item label="显示" name="visible" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

**Step 2: 提交**

```bash
git add src/app/admin/projects
git commit -m "feat: 添加项目管理后台"
```

---

## Phase 8: 首页整合和优化 (Day 10)

### Task 13: 整合所有板块到首页

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/SectionRenderer.tsx`

**Step 1: 更新 SectionRenderer 支持新板块**

修改 `src/components/home/SectionRenderer.tsx`:

```typescript
import dynamic from 'next/dynamic';

const sections = {
  about: dynamic(() => import('./AboutSection')),
  timeline: dynamic(() => import('./TimelineSection')),
  knowledge: dynamic(() => import('./KnowledgeSection')),
  plans: dynamic(() => import('./PlanSection')),
  interests: dynamic(() => import('./InterestSection')),
  projects: dynamic(() => import('./ProjectsSection')),
  career: dynamic(() => import('./CareerPathSection')),
  life: dynamic(() => import('./LifeSection'))
};

// 更新组件映射
```

**Step 2: 更新首页**

修改 `src/app/page.tsx`:

```typescript
// 导入新板块
import ProjectsSection from '@/components/home/ProjectsSection';
import CareerPathSection from '@/components/home/CareerPathSection';
import LifeSection from '@/components/home/LifeSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* 英雄区域 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedCircuit />
        <DataFlowParticles />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-bold text-white mb-6">
            Oliver
          </h1>
          <p className="text-2xl text-cyan-400 mb-4">
            半导体/集成电路行业生产管理专家
          </p>
          <p className="text-slate-400 mb-8">
            15年经验 | 车规级芯片测试工厂建设 | AI编程实践者
          </p>

          {/* 装饰性芯片 */}
          <div className="flex justify-center gap-8 mt-12">
            <EnhancedChip size="md" glowing />
            <EnhancedChip size="lg" glowing rotating />
            <EnhancedChip size="md" glowing />
          </div>
        </div>
      </section>

      {/* 项目成果 */}
      <ProjectsSection />

      {/* 职业轨迹 */}
      <CareerPathSection />

      {/* 知识库 */}
      <KnowledgeSection />

      {/* 生活展示 */}
      <LifeSection />

      {/* 其他板块根据配置动态渲染 */}
      <SectionRenderer />
    </main>
  );
}
```

**Step 3: 提交**

```bash
git add src/app/page.tsx src/components/home/SectionRenderer.tsx
git commit -m "feat: 整合所有板块到首页"
```

---

## Phase 9: 测试和优化 (Day 11)

### Task 14: 端到端测试

**Step 1: 运行开发服务器**

```bash
npm run dev
```

**Step 2: 测试清单**

使用浏览器测试以下功能：

**数据库功能**
- [ ] 首页能正确加载数据库数据
- [ ] 管理后台能增删改查各板块数据
- [ ] 数据刷新后仍然存在

**图片上传**
- [ ] 能成功上传图片
- [ ] 图片正确显示在页面上
- [ ] 能删除图片

**新板块**
- [ ] ProjectsSection 正常显示
- [ ] CareerPathSection 正常显示
- [ ] LifeSection 正常显示

**视觉效果**
- [ ] 芯片动画正常播放
- [ ] 电路背景流动效果正常
- [ ] 粒子效果正常
- [ ] 悬停发光效果正常

**响应式**
- [ ] 移动端布局正常
- [ ] 平板端布局正常
- [ ] 桌面端布局正常

**Step 3: 性能检查**

```bash
npm run build
```

检查构建输出，确保没有错误或警告。

**Step 4: 提交**

```bash
git add .
git commit -m "test: 完成端到端测试和优化"
```

---

## Phase 10: 部署准备 (Day 12)

### Task 15: 生产环境配置

**Files:**
- Create: `docs/DEPLOYMENT.md`
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: 创建部署文档**

创建 `docs/DEPLOYMENT.md`:

```markdown
# 部署指南

## 开发环境

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 生产环境

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量:
   - `DATABASE_URL`: file:./prod.db (使用 Vercel Storage 或其他数据库)
3. 部署时会自动运行:
   - `npx prisma generate`
   - `npx prisma migrate deploy`

### 数据库迁移

```bash
npx prisma migrate deploy
```

### 备份数据

定期备份 SQLite 数据库文件:
```bash
cp prisma/dev.db backups/dev-$(date +%Y%m%d).db
```

## 环境变量

参考 `.env.example` 创建 `.env` 文件。
```

**Step 2: 创建环境变量示例**

创建 `.env.example`:

```env
# 数据库
DATABASE_URL="file:./dev.db"

# 可选：其他服务
# NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

**Step 3: 更新 .gitignore**

确保添加:
```
# Prisma
prisma/*.db
prisma/*.db-journal
*.db
*.db-journal

# 上传文件
public/uploads/*
!public/uploads/.gitkeep
```

**Step 4: 提交**

```bash
git add docs .env.example .gitignore
git commit -m "docs: 添加部署文档和环境配置"
```

---

## 最终验证清单

在完成所有任务后，验证以下内容：

### 功能完整性
- [x] 数据库迁移完成（Prisma + SQLite）
- [x] 所有板块支持数据库存储
- [x] 图片上传和管理功能正常
- [x] 4个新板块创建完成（项目、职业轨迹、知识输出、生活）
- [x] 管理后台支持所有板块管理

### 视觉效果
- [x] 增强版芯片组件（旋转、发光）
- [x] 动态电路背景（流动光效）
- [x] 数据流动粒子效果
- [x] 悬停发光效果

### 代码质量
- [x] TypeScript 类型完整
- [x] 组件模块化清晰
- [x] API 路由规范
- [x] 错误处理完善

### 文档
- [x] 部署文档完整
- [x] 环境变量配置示例
- [x] README 更新（如需要）

---

## 执行说明

此计划按天分为 12 个阶段，每个阶段包含 1-3 个具体任务。

**建议执行顺序：**
1. Phase 1-2: 数据库基础设施
2. Phase 3-4: 组件迁移到 API
3. Phase 5: 视觉增强
4. Phase 6: 新内容板块
5. Phase 7: 管理后台
6. Phase 8-9: 整合测试
7. Phase 10: 部署准备

**每个任务步骤：**
1. 执行命令/创建文件
2. 验证功能正常
3. Git commit
4. 继续下一步

**预计时间：** 10-12 天（每天 2-3 小时）
