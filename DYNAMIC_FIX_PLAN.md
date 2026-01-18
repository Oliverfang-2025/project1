# 全面动态化修复计划

## 目标
将所有8个硬编码模块改为后台管理，实现完整的CMS功能

## 优先级矩阵

| 优先级 | 模块 | 后台 | 前端 | 复杂度 |
|--------|------|------|------|--------|
| P0 | 社交媒体 | ✅ | ❌ | 简单 |
| P0 | 联系信息 | ✅ | ❌ | 简单 |
| P1 | 兴趣 | ❌ | ❌ | 中等 |
| P1 | 时间线 | ❌ | ❌ | 中等 |
| P1 | 计划 | ❌ | ❌ | 中等 |
| P2 | 页面内容 | ✅ | ❌ | 复杂 |
| P2 | 关于页 | ❌ | ❌ | 复杂 |
| P2 | 导航 | ❌ | ❌ | 简单 |

---

## P0阶段：社交媒体动态化（30分钟）

### 修改文件
1. `src/components/layout/Footer.tsx` - 从localStorage读取
2. `src/app/contact/page.tsx` - 从localStorage读取

### 关键代码
```typescript
// Footer.tsx
const [socialLinks, setSocialLinks] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem('social_links');
  if (stored) setSocialLinks(JSON.parse(stored));
}, []);
```

---

## P0阶段：联系信息动态化（30分钟）

### 修改文件
1. `src/app/contact/page.tsx` - 动态读取电话、邮箱、地址
2. `src/app/about/page.tsx` - 动态读取联系信息

### 关键代码
```typescript
const [contactInfo, setContactInfo] = useState({});

useEffect(() => {
  const stored = localStorage.getItem('contact_info');
  if (stored) setContactInfo(JSON.parse(stored));
}, []);
```

---

## P1阶段：兴趣板块系统（1小时）

### 新建文件
1. `src/types/interest.ts` - 类型定义
2. `src/lib/interest-storage.ts` - 存储工具
3. `src/app/admin/interests/page.tsx` - 管理页面

### 修改文件
`src/components/home/InterestSection.tsx` - 从localStorage读取

### 数据结构
```typescript
interface Interest {
  id: string;
  name: string;
  description: string;
  category: string;
}
```

---

## P1阶段：时间线板块系统（1小时）

### 新建文件
1. `src/types/timeline.ts` - 类型定义
2. `src/lib/timeline-storage.ts` - 存储工具
3. `src/app/admin/timeline/page.tsx` - 管理页面

### 修改文件
`src/components/home/TimelineSection.tsx` - 从localStorage读取

### 数据结构
```typescript
interface TimelineItem {
  id: string;
  title: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
}
```

---

## P1阶段：计划板块系统（1小时）

### 新建文件
1. `src/types/plan.ts` - 类型定义
2. `src/lib/plan-storage.ts` - 存储工具
3. `src/app/admin/plans/page.tsx` - 管理页面

### 修改文件
1. `src/components/home/PlanSection.tsx` - 从localStorage读取
2. `src/app/plans/page.tsx` - 从localStorage读取

### 数据结构
```typescript
interface Plan {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
}
```

---

## P2阶段：页面内容系统（2小时）

### 修改文件
1. `src/app/about/page.tsx` - 读取website_pages配置
2. `src/app/contact/page.tsx` - 读取website_pages配置

### 实施方式
使用现有的`src/lib/page-storage.ts`工具（后台已存在）

---

## P2阶段：关于页动态化（1小时）

### 新建文件
1. `src/types/about.ts` - 类型定义
2. `src/lib/about-storage.ts` - 存储工具
3. `src/app/admin/about/page.tsx` - 管理页面

### 修改文件
`src/app/about/page.tsx` - 技能、经历、教育动态化

---

## P2阶段：导航配置（30分钟）

### 新建文件
1. `src/lib/nav-storage.ts` - 存储工具
2. `src/app/admin/navigation/page.tsx` - 管理页面

### 修改文件
`src/app/navbar/page.tsx` - 从localStorage读取

---

## 实施顺序

1. **P0阶段**（1小时）：社交媒体 + 联系信息
2. **P1阶段**（3小时）：兴趣 + 时间线 + 计划
3. **P2阶段**（3.5小时）：页面内容 + 关于页 + 导航

**总计：约6-7小时**

---

## 关键文件清单

### 新建（15个）
- 类型：social.ts, interest.ts, timeline.ts, plan.ts, about.ts
- 存储：social-storage.ts, contact-storage.ts, interest-storage.ts, timeline-storage.ts, plan-storage.ts, about-storage.ts, nav-storage.ts
- 后台：interests, timeline, plans, about, navigation

### 修改（10个）
- Footer.tsx, Contact.tsx, InterestSection.tsx, TimelineSection.tsx, PlanSection.tsx, About.tsx, AboutSection.tsx, navbar.tsx, admin/layout.tsx, plans/page.tsx

---

## 成功标准

- ✅ 所有硬编码移除
- ✅ 所有模块后台可管
- ✅ 前端实时更新
- ✅ localStorage持久化
- ✅ 无编译错误
- ✅ 性能未降低
