// Knowledge management types for articles and columns

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  type: 'free' | 'paid';
  readTime?: number; // For free articles
  price?: number; // For paid articles
  publishDate: string; // ISO format
  features?: string[]; // For paid articles
  chapters?: Chapter[]; // For paid articles
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  title: string;
  duration: string;
  free: boolean;
}

export interface KnowledgeConfig {
  articles: Article[];
  version: string;
  lastModified: number;
}

// Sample data for initialization
export const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: '前端开发最佳实践',
    excerpt: '了解现代前端开发的最佳实践和常见陷阱',
    content: `# 前端开发最佳实践

## 引言

前端开发在过去几年中发展迅速，新的工具和框架层出不穷。在这篇文章中，我将分享一些前端开发的最佳实践，帮助你构建更高质量的应用。

## 1. 组件化开发

### 1.1 单一职责原则

每个组件应该只负责一个功能。保持组件小而专注，使其更容易理解、测试和维护。

### 1.2 组件复用

通过 props 使组件可配置和复用。

## 2. 性能优化

### 2.1 代码分割

使用 React.lazy 和 Suspense 进行代码分割。

### 2.2 useMemo 和 useCallback

合理使用 useMemo 和 useCallback 避免不必要的计算。

## 3. 状态管理

选择合适的工具：useState、useReducer、Context API、Zustand 等。

## 4. 类型安全

使用 TypeScript 增强代码质量。

## 总结

前端开发的最佳实践是一个不断演进的领域。保持学习，关注社区动态，持续改进你的代码质量。`,
    category: '前端开发',
    type: 'free',
    readTime: 8,
    publishDate: '2023-05-15',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    title: 'Node.js性能优化指南',
    excerpt: '如何优化Node.js应用性能，提高响应速度',
    content: '# Node.js性能优化指南\n\n## 内容准备中...\n\n这篇文章将涵盖 Node.js 性能优化的各个方面。',
    category: '后端开发',
    type: 'free',
    readTime: 12,
    publishDate: '2023-06-22',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    title: 'React状态管理策略',
    excerpt: '比较不同的React状态管理库和方法',
    content: '# React状态管理策略\n\n## 内容准备中...\n\n这篇文章将比较不同的 React 状态管理方案。',
    category: '前端开发',
    type: 'free',
    readTime: 10,
    publishDate: '2023-07-08',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '101',
    title: '高级系统架构设计',
    excerpt: '从零开始设计高可用、可扩展的系统架构',
    content: '本专栏将带你从零开始设计高可用、可扩展的系统架构。',
    category: '系统架构',
    type: 'paid',
    price: 29.9,
    publishDate: '2023-04-10',
    features: ['高可用性设计', '微服务架构', '性能优化', '监控告警'],
    chapters: [
      { title: '第一章：架构设计基础', duration: '45分钟', free: true },
      { title: '第二章：高可用性设计', duration: '60分钟', free: false },
      { title: '第三章：微服务架构', duration: '75分钟', free: false },
      { title: '第四章：性能优化策略', duration: '50分钟', free: false },
      { title: '第五章：监控与告警', duration: '40分钟', free: false }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '102',
    title: '微服务实战指南',
    excerpt: '微服务架构的实际实施步骤和经验分享',
    content: '本专栏分享微服务架构的实际实施步骤和经验。',
    category: '系统架构',
    type: 'paid',
    price: 39.9,
    publishDate: '2023-05-20',
    features: ['服务拆分', 'API 网关', '服务发现', '容器化部署'],
    chapters: [
      { title: '第一章：微服务概述', duration: '30分钟', free: true },
      { title: '第二章：服务拆分策略', duration: '55分钟', free: false },
      { title: '第三章：API 网关设计', duration: '65分钟', free: false },
      { title: '第四章：服务发现与注册', duration: '50分钟', free: false },
      { title: '第五章：容器化与编排', duration: '70分钟', free: false },
      { title: '第六章：分布式追踪', duration: '45分钟', free: false }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
