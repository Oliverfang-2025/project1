# Vercel 部署指南

## 1. Neon 数据库（已连接 ✅）

你已经在 Vercel 中连接了 **Neon** PostgreSQL 数据库。环境变量 `DATABASE_URL` 会自动配置到项目中。

## 2. 部署到 Vercel

```bash
# 提交代码到 Git
git add .
git commit -m "feat: 添加 Neon PostgreSQL 支持"
git push

# Vercel 会自动部署
```

## 3. 初始化数据库

部署成功后，访问以下 URL 初始化数据库并创建默认管理员：

```
https://你的域名/api/init-db
```

默认账户：
- 用户名：`admin`
- 密码：`admin123`

**重要：首次登录后请立即修改密码！**

## 4. 本地开发（可选）

如果想在本地连接 Neon 数据库：

1. 在 Vercel Dashboard → Storage → Neon
2. 点击 **Quickstart** → **.env.local**
3. 点击 **Show secret** 显示完整的连接字符串
4. 复制 `DATABASE_URL` 的值到项目根目录的 `.env.local` 文件

```bash
# .env.local 文件内容（示例）
DATABASE_URL="postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require"
```

## Neon 免费额度

Neon Free 计划：
- 存储：0.5 GB
- 计算时间：191.9 小时/月
- 数据：3 GB/月

**个人网站完全够用！**
