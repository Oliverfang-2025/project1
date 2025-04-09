# 项目结构

## 目录结构
```
website-frontend/
├── node_modules/         # 依赖库
├── public/               # 静态资源
│   └── images/           # 图片资源
│       └── placeholder.jpg  # 示例图片
├── src/                  # 源代码
│   ├── app/              # Next.js App Router
│   ├── components/       # React组件
│   ├── contexts/         # React上下文
│   ├── hooks/            # 自定义钩子
│   ├── lib/              # 通用库
│   ├── pages/            # Next.js Pages Router(如果使用)
│   ├── styles/           # 样式
│   ├── types/            # TypeScript类型定义
│   └── utils/            # 工具函数
├── next.config.js        # Next.js配置
├── postcss.config.js     # PostCSS配置
├── tailwind.config.js    # TailwindCSS配置
├── tsconfig.json         # TypeScript配置
├── package.json          # 项目依赖和脚本
└── README.md             # 项目说明
```

## 目录说明

### `public/`
包含所有静态资源，如图片、字体、favicon等。这些文件可以通过根URL直接访问。

### `src/app/`
使用Next.js 13+的App Router，包含所有页面路由和布局。文件路径将映射到URL路径。

### `src/components/`
包含所有可重用的React组件，按功能或页面分组。
- `common/` - 公共组件，如按钮、卡片等
- `layout/` - 布局相关组件，如标头、页脚等
- `[feature]/` - 特定功能的组件，如用户配置文件、博客等

### `src/contexts/`
React上下文提供者，用于状态管理。

### `src/hooks/`
自定义React钩子。

### `src/lib/`
第三方库的包装器和API客户端。

### `src/pages/`
如果使用Pages Router，包含所有页面。

### `src/styles/`
全局样式和TailwindCSS自定义样式。

### `src/types/`
TypeScript类型定义。

### `src/utils/`
实用工具函数和辅助方法。

## 配置文件
- `next.config.js` - Next.js配置
- `postcss.config.js` - PostCSS配置，用于TailwindCSS
- `tailwind.config.js` - TailwindCSS配置

## 命名约定

### 组件
- 使用PascalCase命名组件文件和目录
- 例：`Button.tsx`, `UserProfile.tsx`

### 样式
- 使用TailwindCSS进行样式设计
- 对于复杂组件，可以使用模块化CSS：`ComponentName.module.css`

## 导入路径
使用别名简化导入语句：
```typescript
// 不推荐
import Button from '../../../../components/common/Button';

// 推荐
import Button from '@/components/common/Button';
```

别名在`tsconfig.json`中配置:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```