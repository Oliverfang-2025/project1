// Section configuration types for homepage customization

export interface SectionConfig {
  id: string;                    // Unique identifier for the section
  name: string;                  // Display name in admin panel
  visible: boolean;              // Whether the section is shown on homepage
  order: number;                 // Sort order (lower numbers appear first)
  component: string;             // Component name to render
  description: string;           // Description for admin panel
}

export interface HomeSectionsConfig {
  sections: SectionConfig[];
  version: string;               // Configuration version for migration
  lastModified: number;          // Last modification timestamp
}

// Default section configuration
export const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: 'about',
    name: '关于我',
    visible: true,
    order: 1,
    component: 'AboutSection',
    description: '个人简介、职业背景和基本信息'
  },
  {
    id: 'plans',
    name: '我的计划',
    visible: true,
    order: 2,
    component: 'PlanSection',
    description: '展示当前的学习和工作计划进度'
  },
  {
    id: 'knowledge',
    name: '知识库',
    visible: true,
    order: 3,
    component: 'KnowledgeSection',
    description: '知识分享和文章列表'
  },
  {
    id: 'interest',
    name: '兴趣爱好',
    visible: true,
    order: 4,
    component: 'InterestSection',
    description: '个人兴趣和爱好展示'
  },
  {
    id: 'timeline',
    name: '心路历程',
    visible: true,
    order: 5,
    component: 'TimelineSection',
    description: '个人成长历程时间线'
  }
];
