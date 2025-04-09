# 个人网站前端

这是一个使用 Next.js 开发的个人网站前端项目，包含了主页、关于我、联系方式等页面，以及一个简单的后台管理系统。

## 技术栈

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript

## 功能特点

- 响应式设计，适配各种设备
- 后台管理系统，可以管理网站内容
- 联系表单，访客可以发送消息
- 社交媒体链接管理

## 如何运行

1. 安装依赖：
   ```
   npm install
   ```

2. 开发模式运行：
   ```
   npm run dev
   ```

3. 构建生产版本：
   ```
   npm run build
   ```

4. 启动生产服务器：
   ```
   npm run start
   ```

## 部署

本项目可以使用 Vercel 一键部署。

## 项目模块

- **首页** - 网站门户，展示所有主要内容的概览
- **关于我** - 个人信息、教育背景和专业技能展示
- **我的计划** - 个人目标和进度跟踪
- **知识库** - 分享技术文章和专业知识
- **兴趣爱好** - 展示个人兴趣和相关内容
- **心路历程** - 类朋友圈的动态记录

## 项目结构

查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解详细的项目结构说明。

## 贡献指南

1. 克隆项目到本地
2. 创建新的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

## 许可证

本项目采用MIT许可证 - 详见 LICENSE 文件 

# Oliver Fang 个人网站

这是一个基于 Next.js 构建的现代化个人网站，展示半导体/集成电路行业生产管理专家 Oliver Fang 的专业背景、职业规划和知识分享。

## 功能特点

- **响应式设计**: 适配各种尺寸的设备屏幕
- **现代化UI**: 使用 Tailwind CSS 构建的美观界面
- **个性化内容**: 展示专业背景、职业规划和知识分享
- **交互体验**: 流畅的页面转换和用户交互
- **联系功能**: 提供多种联系方式和社交媒体链接

## 页面结构

- **首页 (/)**: 展示个人简介和网站主要内容的入口
- **关于我 (/about)**: 详细的个人介绍、专业技能、工作经验和教育背景
- **职业规划 (/plans)**: 展示职业目标和项目规划时间线
- **知识分享 (/knowledge)**: 分享专业知识和行业见解
- **联系方式 (/contact)**: 提供多种联系方式和社交媒体链接

## 联系页面

联系页面提供了多种与Oliver Fang取得联系的方式：

- **联系表单**: 直接在网站上发送消息
- **联系信息**: 包含电话、邮箱和位置信息
- **社交媒体链接**:
  - B站: https://space.bilibili.com/209748514
  - 微信公众号: https://mp.weixin.qq.com/s/eqi0peIX25QuMYaN1uI6qA
  - LinkedIn: www.linkedin.com/in/邈霖-oliver-方（fang）-396908105

## 技术栈

- **前端框架**: Next.js 14
- **UI框架**: Tailwind CSS
- **编程语言**: TypeScript
- **包管理器**: npm
- **部署**: Vercel

## 开发指南

### 环境要求

- Node.js 18+ 
- npm 9+

### 安装依赖

```bash
cd website-frontend
npm install
```

### 开发服务器

```bash
cd website-frontend
npm run dev
```

然后在浏览器中访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
cd website-frontend
npm run build
```

### 启动生产服务器

```bash
cd website-frontend
npm run start
```

## 项目目录结构

```
website-frontend/
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── app/              # 页面组件
│   │   ├── page.tsx      # 首页
│   │   ├── about/        # 关于页面
│   │   ├── plans/        # 职业规划页面
│   │   ├── knowledge/    # 知识分享页面
│   │   ├── contact/      # 联系方式页面
│   │   └── layout.tsx    # 全局布局
│   ├── components/       # 可复用组件
│   ├── styles/           # 全局样式
│   └── types/            # TypeScript类型定义
├── package.json          # 项目依赖
└── tailwind.config.js    # Tailwind配置
```

## 许可证

MIT 