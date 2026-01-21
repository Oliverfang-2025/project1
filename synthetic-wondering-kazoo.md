# 个人品牌网站全面重构计划

## 项目概述

**目标**：将现有网站升级为高端、专业的科技未来风格个人品牌平台

**定位**：半导体/芯片行业个人品牌名片 + 复利内容平台

---

## 核心升级内容

| 维度 | 当前状态 | 升级目标 |
|------|---------|---------|
| 视觉风格 | 浅色/蓝色主题 | **暗色科技主题** (类似 Linear/Vercel) |
| UI 组件库 | Ant Design (未充分使用) | **shadcn/ui + Radix UI** |
| 动效 | 基础 CSS | **Framer Motion** (微妙精致) |
| 国际化 | 无 | **中英文双语** (next-intl) |
| 数据存储 | localStorage | **PostgreSQL** (Neon) |
| 功能 | 基础展示 | **+博客 +作品集** |

---

## Phase 1: 基础架构搭建

### 1.1 安装新依赖
```bash
npm install framer-motion next-intl
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm uninstall antd  # 移除 Ant Design
```

### 1.2 配置暗色主题
**修改文件**: `tailwind.config.js`
- 添加暗色背景层次 (`#0a0a0f`, `#111118`, `#1a1a24`)
- 添加科技蓝主色 + 青色强调色
- 配置字体 (Inter + Noto Sans SC)

### 1.3 配置国际化
**新建文件**:
- `src/i18n/request.ts` - 国际化配置
- `src/middleware.ts` - 路由中间件
- `messages/zh.json` - 中文翻译
- `messages/en.json` - 英文翻译

### 1.4 创建基础 UI 组件
**新建目录**: `src/components/ui/`
- `button.tsx` - 按钮组件
- `card.tsx` - 卡片组件
- `input.tsx` - 输入框
- `dialog.tsx` - 对话框
- `dropdown.tsx` - 下拉菜单

### 1.5 扩展数据库表
**修改文件**: `src/app/api/init-db/route.ts`
```sql
-- 新增表
articles (博客文章)
projects (作品集项目)
site_config (站点配置)
messages (访客消息)
timeline_events (时间线)
```

---

## Phase 2: 前台页面重构

### 2.1 新页面结构
```
src/app/
├── [locale]/                    # 国际化路由
│   ├── layout.tsx              # 前台布局 (Header+Footer)
│   ├── page.tsx                # 首页
│   ├── about/page.tsx          # 关于我
│   ├── blog/
│   │   ├── page.tsx            # 博客列表
│   │   └── [slug]/page.tsx     # 博客详情
│   ├── projects/
│   │   ├── page.tsx            # 作品集
│   │   └── [slug]/page.tsx     # 项目详情
│   ├── timeline/page.tsx       # 职业历程
│   └── contact/page.tsx        # 联系方式
└── admin/                       # 后台 (独立路由)
```

### 2.2 重点页面设计

#### 首页 (page.tsx)
- **Hero 区域**: 全屏暗色背景 + 网格动画 + 个人标语
- **精选作品**: 3 个项目卡片 + 查看更多
- **最新博客**: 3 篇文章预览
- **关于预览**: 个人简介 + CTA 按钮

#### 博客页 (blog/page.tsx)
- 筛选器 (分类/标签)
- 文章卡片网格
- 分页

#### 作品集 (projects/page.tsx)
- 项目卡片 (封面 + 技术栈标签)
- Hover 展示详情
- 筛选功能

### 2.3 关键组件更新
| 组件 | 改动 |
|------|------|
| `Header.tsx` | 暗色主题 + 语言切换 + 发光下划线动效 |
| `Footer.tsx` | 暗色主题 + 社交链接图标 |
| `DifyChat.tsx` | 保留，调整气泡样式适配暗色主题 |

---

## Phase 3: 后台管理重构

### 3.1 精简后台结构
```
src/app/admin/
├── layout.tsx           # 暗色侧边栏布局
├── page.tsx             # 仪表盘
├── articles/page.tsx    # 文章管理 (合并原 knowledge)
├── projects/page.tsx    # 项目管理 (新增)
├── timeline/page.tsx    # 时间线管理
├── messages/page.tsx    # 消息管理
├── site-config/page.tsx # 站点配置 (合并 nav/social/contact)
└── settings/page.tsx    # 账户设置
```

### 3.2 数据迁移
将现有 localStorage 数据迁移到 PostgreSQL:
- `knowledge-storage` → `articles` 表
- `nav-storage` → `site_config` 表
- `section-storage` → `site_config` 表
- `timeline-storage` → `timeline_events` 表

### 3.3 新增 API 路由
```
src/app/api/
├── articles/         # 文章 CRUD
├── projects/         # 项目 CRUD
├── timeline/         # 时间线 CRUD
├── messages/         # 消息管理
└── site-config/      # 配置管理
```

---

## Phase 4: 动效与优化

### 4.1 Framer Motion 集成
- 页面入场动画 (淡入 + 上移)
- 列表交错动画 (staggerChildren)
- 滚动触发动画 (whileInView)
- Hover 微动效 (卡片抬升 + 发光)

### 4.2 性能优化
- 图片懒加载 + Next.js Image 优化
- 代码分割 (dynamic import)
- 字体子集化

### 4.3 SEO 优化
- 每页独立 metadata
- 结构化数据 (JSON-LD)
- Open Graph 标签

---

## 关键文件清单

| 文件路径 | 操作 |
|---------|------|
| `tailwind.config.js` | 修改 - 暗色主题色彩系统 |
| `src/styles/globals.css` | 修改 - 暗色基础样式 |
| `src/app/layout.tsx` | 修改 - 国际化 Provider |
| `src/middleware.ts` | 新建 - 国际化路由 |
| `src/components/ui/*` | 新建 - shadcn/ui 组件 |
| `src/app/[locale]/*` | 新建 - 国际化页面 |
| `src/app/api/init-db/route.ts` | 修改 - 新增数据库表 |
| `src/lib/db.ts` | 修改 - 扩展 CRUD 操作 |
| `messages/zh.json` | 新建 - 中文翻译 |
| `messages/en.json` | 新建 - 英文翻译 |

---

## 验证方案

### 每阶段验收
| 阶段 | 验证方式 |
|------|---------|
| Phase 1 | `npm run build` 成功 + 访问 /api/init-db 创建表 |
| Phase 2 | 前台页面响应式正常 + 中英文切换正确 |
| Phase 3 | 后台 CRUD 功能完整 + 数据持久化验证 |
| Phase 4 | Lighthouse 性能 > 90 + 动效流畅 |

### 最终验收清单
- [ ] 暗色主题全站一致
- [ ] 中英文切换无遗漏
- [ ] 博客发布完整流程
- [ ] 项目展示完整流程
- [ ] 后台数据正确同步到前台
- [ ] 移动端体验良好
- [ ] 无控制台错误

---

## 实施顺序建议

1. **Phase 1** → 先搭建基础架构，确保不破坏现有功能
2. **Phase 2** → 逐页重构前台，可以与旧页面并行存在
3. **Phase 3** → 后台重构 + 数据迁移
4. **Phase 4** → 优化收尾

每个 Phase 完成后部署测试，确认无问题再进入下一阶段。
