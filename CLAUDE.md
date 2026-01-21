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
- **Next.js 14** - App Router (非 Pages Router)
- **React 18** - 所有组件使用 `"use client"` 指令
- **TypeScript** - 严格模式已关闭 (`strict: false`)
- **Tailwind CSS** - 样式系统
- **Ant Design** (antd) - UI 组件库

### 目录结构
```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx          # 根布局 (Header + Footer + DifyChat)
│   ├── page.tsx            # 首页
│   ├── navbar/page.tsx     # 导航栏 (通过 dynamic import, SSR: false)
│   ├── about/              # 关于页面
│   ├── plans/              # 职业规划页面
│   ├── knowledge/          # 知识分享页面
│   ├── contact/            # 联系方式页面
│   └── admin/              # 后台管理系统
│       ├── layout.tsx      # 管理后台布局 (侧边栏导航)
│       ├── login/          # 登录页
│       ├── page.tsx        # 仪表盘
│       ├── messages/       # 消息管理
│       ├── pages/          # 页面内容管理
│       ├── social/         # 社交媒体管理
│       └── contact-info/   # 联系信息管理
├── components/
│   ├── DifyChat.tsx        # Dify 聊天机器人集成
│   ├── layout/             # Header, Footer
│   └── home/               # 首页各区域组件
└── styles/
    └── globals.css         # 全局样式 + Tailwind
```

### 关键架构决策

#### 1. 全客户端渲染 (CSR)
所有组件使用 `"use client"`，导航栏通过 `dynamic import` 禁用 SSR:
```tsx
const Navbar = dynamic(() => import('@/app/navbar/page'), { ssr: false });
```

#### 2. 管理后台认证 (Neon PostgreSQL)
- 数据库: Neon PostgreSQL (通过 Vercel 集成)
- 认证 API: `/api/admin/login` (POST)
- 密码修改: `/api/admin/change-password` (POST)
- 认证状态存储在 `localStorage.getItem('admin_auth')`
- 包含 `isLoggedIn`、`username` 和 `expiresAt` 字段
- 失效时自动重定向到 `/admin/login`
- 默认账户: `admin` / `admin123` (首次登录后需修改密码)

#### 3. Dify 聊天机器人集成
配置在 `DifyChat.tsx`:
- `token`: API 密钥
- `serverUrl`: `https://udify.app`
- 动态加载脚本: `{serverUrl}/embed.min.js`
- 自定义样式覆盖气泡按钮和窗口大小

#### 4. 导入路径别名
使用 `@/` 前缀引用 `src/` 目录:
```tsx
import Header from '@/components/layout/Header';
```

### Tailwind 自定义颜色
- `primary` - 蓝色系 (#0284c7 基色)
- `secondary` - 紫色系 (#7c3aed 基色)
- `neutral` - 灰色系

### 图片域名
Next.js 配置允许从 `oss.of2088.top` 加载图片 (阿里云 OSS)

## 管理后台菜单结构
| 路径 | 名称 |
|------|------|
| `/admin` | 仪表盘 |
| `/admin/messages` | 消息管理 |
| `/admin/pages` | 页面内容 |
| `/admin/social` | 社交媒体 |
| `/admin/contact-info` | 联系方式 |

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
// ✅ 正确
const handleSubmit = async (e: any) => {
  e.preventDefault();
}

// ❌ 错误 (会导致构建失败)
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
