import { ReactNode } from 'react';

// 回复接口
export interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishDate: string;
  likes: number;
}

// 评论接口
export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishDate: string;
  likes: number;
  replies?: Reply[];
}

// 评论区组件Props接口
export interface CommentSectionProps {
  comments: Comment[];
  articleId: string;
}

// 知识项目接口
export interface KnowledgeItem {
  id: string;
  title: string;
  type: 'article' | 'wechat' | 'pdf';
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: string;
  likes: number;
  comments: number | Comment[];
  readTime: number;
  fileUrl?: string;
  fileSize?: string;
  filePages?: number | string;
  originalLink?: string;
  wechatAccount?: string;
  summary?: string;
}

// 知识卡片Props接口
export interface KnowledgeCardProps {
  item: KnowledgeItem;
}

// 分类接口
export interface Category {
  id: string;
  name: string;
}

// 知识过滤器Props接口
export interface KnowledgeFilterProps {
  categories: Category[];
  tags: string[];
  activeCategory: string;
  activeTags: string[];
  onCategoryChange: (category: string) => void;
  onTagToggle: (tag: string) => void;
}

// 知识排序器Props接口
export interface KnowledgeSorterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
} 