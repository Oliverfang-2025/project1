# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

### 开发
```bash
npm run dev       # 启动开发服务器 (http://localhost:3000)
npm run build     # 构建生产版本
npm run start     # 启动生产服务器
npm run lint      # 运行 ESLint
```

## 项目架构

### 技术栈
- **Next.js 14** - App Router + next-intl 国际化路由
- **React 18** - 客户端组件 (`"use client"`)
- **TypeScript** - 严格模式已关闭 (`strict: false`)
- **Tailwind CSS** - 样式系统 + tailwind-merge
- **Radix UI** - 无样式基础组件 (Dialog, Dropdown, Tabs, Tooltip)
- **Framer Motion** - 动画库
- **next-intl** - 国际化 (中文/英文)
- **react-markdown** + rehype-highlight + remark-gfm - Markdown 渲染
- **Lucide React** - 图标库
- **@dnd-kit** - 拖拽排序
- **Neon PostgreSQL** + pg - 数据库 (生产/本地双模式)

### 目录结构
```
src/
├── app/
│   ├── layout.tsx              # 根布局 (NextIntlClientProvider + DifyChat)
│   ├── sitemap.ts              # 动态站点地图
│   ├── not-found.tsx           # 404 页面
│   ├── [locale]/               # 国际化路由 (zh/en)
│   │   ├── layout.tsx          # Locale 布局 (Header/Footer 条件渲染)
│   │   ├── page.tsx            # 首页
│   │   ├── about/              # 关于页面
│   │   ├── blog/               # 博客
│   │   │   ├── page.tsx        # 文章列表
│   │   │   └── [slug]/page.tsx # 文章详情 (Markdown)
│   │   ├── projects/           # 项目作品集
│   │   │   ├── page.tsx        # 项目列表
│   │   │   └── [slug]/page.tsx # 项目详情
│   │   ├── timeline/           # 时间线
│   │   └── contact/            # 联系页面
│   ├── admin/                  # 管理后台 (不经过 i18n)
│   │   ├── layout.tsx          # 后台布局 (侧边栏 + 认证)
│   │   ├── login/              # 登录页
│   │   ├── page.tsx            # 仪表盘
│   │   ├── articles/           # 文章管理
│   │   ├── projects/           # 项目管理
│   │   ├── timeline/           # 时间线管理
│   │   ├── messages/           # 消息管理
│   │   ├── site-config/        # 站点配置
│   │   └── settings/           # 账户设置
│   └── api/                    # API 路由 (详见 API 文档)
├── components/
│   ├── ui/                     # 基础 UI 组件库 (Button, Card, Dialog, Input 等)
│   ├── layout/                 # Header, Footer
│   ├── home/                   # 首页各区域组件 (SectionRenderer 等)
│   ├── animations/             # Framer Motion 动画包装器
│   ├── semiconductors/         # 半导体主题交互组件库
│   ├── patterns/               # 视觉图案 (ChipShape, WaferPattern)
│   ├── seo/                    # JsonLd 结构化数据
│   └── DifyChat.tsx            # Dify 聊天机器人集成
├── i18n/
│   ├── routing.ts              # Locale 路由配置 (zh/en, 默认 zh)
│   └── request.ts              # 消息加载器
├── lib/
│   ├── db.ts                   # 数据库连接 (Neon serverless / pg Pool)
│   ├── auth.ts                 # 认证辅助
│   ├── metadata.ts             # SEO 元数据辅助
│   ├── dynamic-sitemap.ts      # 站点地图生成
│   └── *-storage.ts            # 各模块数据存取层
├── types/                      # TypeScript 类型定义
├── config/
│   └── semiconductorAnimations.ts  # 半导体动画配置
├── styles/
│   └── globals.css             # 全局样式 + Tailwind
└── middleware.ts               # next-intl 中间件 (排除 /api, /admin)
messages/
├── zh.json                     # 中文翻译
└── en.json                     # 英文翻译
```

### 关键架构决策

#### 1. 国际化 (i18n)
- 使用 **next-intl** 实现中英双语
- 路由前缀: `/zh/...` 和 `/en/...`，默认 `zh`
- 翻译文件位于 `messages/zh.json` 和 `messages/en.json`
- Middleware (`src/middleware.ts`) 自动拦截路由并添加 locale 前缀
- Admin 和 API 路由不经过 i18n 处理
- 页面中使用 `useTranslations('namespace')` 获取翻译

#### 2. 布局层级
```
Root Layout (layout.tsx)
  → NextIntlClientProvider (提供翻译上下文)
  → DifyChat (全局聊天机器人)
  └── Locale Layout ([locale]/layout.tsx)
        → Header (非 admin 路由显示)
        → {children}
        → Footer (非 admin 路由显示)
```

#### 3. 数据库架构 (Neon PostgreSQL)
- 连接模块: `src/lib/db.ts`，根据环境自动选择连接方式:
  - **生产环境 (Vercel/Neon)**: `@neondatabase/serverless` (HTTP 模式)
  - **本地开发**: `pg` Pool (TCP 连接)
- 环境检测逻辑: URL 包含 `neon.tech` 或 `VERCEL=1` 时使用 Neon
- 数据库表:
  | 表名 | 说明 | 双语字段 |
  |------|------|----------|
  | `admins` | 管理员账户 | - |
  | `articles` | 博客文章 | title_zh/en, content_zh/en, excerpt_zh/en |
  | `projects` | 项目作品集 | title_zh/en, description_zh/en |
  | `timeline_events` | 时间线事件 | title_zh/en, description_zh/en |
  | `messages` | 访客留言 | - |
  | `site_config` | 站点配置 (JSONB) | - |
- 双语字段命名约定: `field_zh` / `field_en`

#### 4. 管理后台认证
- 认证 API: `/api/admin/login` (POST), `/api/admin/change-password` (POST)
- 认证状态存储在 `localStorage.getItem('admin_auth')`
- 包含 `isLoggedIn`、`username` 和 `expiresAt` 字段
- 失效时自动重定向到 `/admin/login`
- 默认账户: `admin` / `admin123` (首次登录后需修改密码)

#### 5. Dify 聊天机器人集成
配置在 `DifyChat.tsx`:
- 动态加载 Dify embed 脚本
- 自定义样式覆盖气泡按钮和窗口大小

#### 6. 导入路径别名
使用 `@/` 前缀引用 `src/` 目录:
```tsx
import Header from '@/components/layout/Header';
```

### API 路由
```
/api/admin/login              POST        管理员登录
/api/admin/change-password    POST        修改密码
/api/articles                 GET/POST    文章列表 / 创建文章
/api/articles/[slug]          GET/PUT/DELETE  文章详情 / 更新 / 删除
/api/articles/[slug]/view     POST        增加浏览量
/api/projects                 GET/POST    项目列表 / 创建项目
/api/projects/[slug]          GET/PUT/DELETE  项目详情 / 更新 / 删除
/api/timeline                 GET/POST    时间线列表 / 创建事件
/api/timeline/[id]            GET/PUT/DELETE  时间线详情 / 更新 / 删除
/api/messages                 GET/POST    留言列表 / 创建留言
/api/messages/[id]            GET/PUT/DELETE  留言详情 / 更新 / 删除
/api/site-config              GET/POST    站点配置读取 / 更新
/api/init-db                  GET         数据库初始化
```

### 管理后台菜单结构
| 路径 | 名称 | 说明 |
|------|------|------|
| `/admin` | 仪表盘 | 数据概览 |
| `/admin/articles` | 文章管理 | 博客文章 CRUD (双语) |
| `/admin/projects` | 项目管理 | 项目作品集 CRUD (双语) |
| `/admin/timeline` | 时间线管理 | 时间线事件 CRUD (双语) |
| `/admin/messages` | 消息管理 | 访客留言收件箱 |
| `/admin/site-config` | 站点配置 | 全局设置 (JSONB) |
| `/admin/settings` | 账户设置 | 密码修改 |

### 内容渲染
博客文章和项目详情使用 Markdown 渲染:
- `react-markdown` - Markdown 解析
- `rehype-highlight` - 代码语法高亮
- `remark-gfm` - GitHub 风格 Markdown (表格、任务列表等)

### SEO 基础设施
- 每个页面有对应的 `page.metadata.ts` 文件 (提供 title, description, OpenGraph)
- `src/components/seo/JsonLd.tsx` - 结构化数据
- `src/app/sitemap.ts` - 动态站点地图
- 字体: Inter (Latin) + Noto Sans SC (中文)

### Tailwind 自定义颜色
- `primary` - 蓝色系 (#0284c7 基色)
- `secondary` - 紫色系 (#7c3aed 基色)
- `neutral` - 灰色系
- 全站深色主题 (`bg-gray-950`)

### 图片域名
Next.js 配置允许从 `oss.of2088.top` 加载图片 (阿里云 OSS)，支持 AVIF + WebP 格式。

## 开发流程规范
### 子代理 (Subagents)
- 启用子代理开发时，必须遵守@Spec/subagents prompt.md 中的规范

### 提交前检查 (Husky Pre-commit)
项目使用 Husky 配置了 pre-commit hook，每次提交前自动运行 `npm run build`。
如果构建失败，提交将被阻止，确保只有通过构建的代码才能提交。

### 提交代码流程
```bash
# 1. 修改代码后，先运行构建检查
npm run build

# 2. 构建成功后，提交代码
git add .
git commit -m "feat: 描述你的改动"
git push

# 如果 pre-commit hook 阻止了提交，根据错误信息修复代码后重试
```

### 类型规范
- 项目使用 TypeScript 但严格模式已关闭 (`strict: false`)
- 事件处理函数使用 `any` 类型避免复杂类型定义
- **禁止使用** `React.FormEvent`、`React.ChangeEvent` 等复杂类型
- **推荐使用** `any` 类型或省略类型注解

```tsx
// correct
const handleSubmit = async (e: any) => {
  e.preventDefault();
}

// wrong (will cause build failure)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
}
```

### 本地开发环境变量
本地开发需要配置 `.env.local` 文件：
```bash
# 从 Vercel Dashboard -> Storage -> Neon 复制 DATABASE_URL
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 部署到 Vercel
1. 推送代码到 GitHub
2. Vercel 自动部署
3. 部署成功后访问 `/api/init-db` 初始化数据库
4. 登录后台修改默认密码
