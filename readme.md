# of2088.top 个人网站项目

## 项目概述

这是一个功能丰富的个人网站项目，用于展示个人信息、分享专业知识、记录个人成长，并提供社交互动功能。本项目专注于Web端体验，提供响应式设计以支持不同设备访问。

## 主要功能

1. **个人信息展示** - 展示个人简介、教育背景、工作经历和专业技能
2. **计划管理** - 记录和展示个人计划和进度跟踪
3. **知识库系统** - 分为免费和付费两部分，支持文章发布、分类管理和标签系统
4. **兴趣爱好展示** - 展示个人兴趣和相关图片画廊
5. **社交互动功能** - 类朋友圈的动态发布、评论和点赞功能

## 技术架构

### 前端技术栈
- Next.js 14.x (React 18.x)
- TailwindCSS
- Ant Design

### 后端技术栈
- **API框架**: Express 4.x
- **数据库**: MongoDB 6.x, Redis 7.x
- **认证与授权**: JWT, Passport.js
- **存储服务**: 阿里云OSS

## 安装指南

### 系统要求
- Node.js 20.x LTS
- MongoDB 6.x
- Redis 7.x
- Docker 和 Docker Compose (可选，推荐用于生产环境)

### 安装步骤

1. **安装Node.js环境**
```bash
# 安装nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# 或Windows版本的nvm-windows: https://github.com/coreybutler/nvm-windows/releases

# 安装Node.js 20.x
nvm install 20
nvm use 20
```

2. **Next.js网站前端**
```bash
# 创建并安装Next.js项目
git clone <项目仓库URL>/website-frontend.git
cd website-frontend
npm install
npm run dev
```

### 后端安装

1. **安装Express后端**
```bash
# 克隆后端项目
git clone <项目仓库URL>/website-backend.git
cd website-backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.development
# 编辑.env.development文件配置数据库连接等

# 启动开发服务器
npm run dev
```

2. **配置环境变量**
- 创建`.env.development`、`.env.test`和`.env.production`文件
- 配置MongoDB、Redis连接信息
- 配置JWT密钥
- 配置阿里云OSS访问密钥

### 数据库安装

1. **MongoDB数据库**
```bash
# Docker方式安装
docker pull mongo:6.0
docker run -d -p 27017:27017 --name mongodb \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0
```

2. **Redis缓存服务**
```bash
# Docker方式安装
docker pull redis:7.0
docker run -d -p 6379:6379 --name redis \
  -v redis_data:/data \
  redis:7.0 redis-server --requirepass "password"
```

### 使用Docker Compose一键部署

```bash
# 克隆项目
git clone <项目仓库URL>/personal-website.git
cd personal-website

# 配置环境变量
# 编辑.env文件

# 启动所有服务
docker-compose up -d

# 查看运行状态
docker-compose ps
```

## 项目结构

```
personal-website/
├── website-frontend/      # Next.js网站前端
├── website-backend/       # Express后端API
├── nginx/                 # Nginx配置
├── scripts/               # 部署和维护脚本
├── docker-compose.yml     # Docker Compose配置
└── README.md              # 项目说明文档
```

## 功能模块说明

### 1. 关于我
展示个人信息、教育背景和工作经历，采用响应式设计，适配各种设备屏幕尺寸。

**使用方法**: 访问首页的"关于我"部分。

### 2. 我的计划
记录和展示个人计划、目标和进度，支持可视化展示和进度跟踪。

**使用方法**: 访问"我的计划"页面，可以查看不同类别的计划和完成进度。

### 3. 知识库
分享专业知识和个人经验，分为免费和付费两部分。

**使用方法**:
- 免费知识库: 无需登录即可访问
- 付费知识库: 需要登录并完成支付解锁内容

### 4. 我的兴趣
展示个人兴趣爱好和相关图片，支持分类展示和图片画廊。

**使用方法**: 访问"我的兴趣"页面，可以浏览不同类别的兴趣内容和图片。

### 5. 心路历程
类似朋友圈的动态发布功能，支持文字、图片、视频，以及评论和点赞互动。

**使用方法**: 登录后访问"心路历程"页面，可以发布动态、评论和点赞。

## API文档

API文档使用Swagger自动生成，可以在开发环境下访问：

```
http://localhost:3001/api-docs
```

## 部署环境

- 域名: of2088.top
- 服务器: 阿里云ECS
- 数据库: MongoDB
- 缓存: Redis
- 存储: 阿里云OSS
- CDN: 阿里云CDN

## 常见问题

1. **Q: 如何添加新的内容到知识库?**
   A: 登录管理员账户，进入后台管理界面，在"内容管理"中选择"添加文章"。

2. **Q: 如何设置付费内容的价格?**
   A: 在后台管理界面的"付费内容管理"中，可以为每篇付费内容设置价格和付费策略。

3. **Q: 如何备份数据库?**
   A: 使用脚本`scripts/backup/mongodb-backup.sh`进行手动备份，或配置定时任务进行自动备份。

## 维护与更新

- 定期更新Node.js和依赖包版本
- 双周迭代开发节奏
- 每月功能更新与安全补丁
- 季度性能评估与优化

## 联系方式

如有问题或建议，请通过以下方式联系：

- 网站: https://of2088.top/contact
- 邮箱: admin@of2088.top

## 许可协议

本项目采用 MIT 许可协议，详见 [LICENSE](LICENSE) 文件。
