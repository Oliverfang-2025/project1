// localStorage utilities for page content management

const STORAGE_KEY = 'website_pages';

// Page content types
export interface PageSection {
  id: string;
  title: string;
  type: 'hero' | 'text' | 'image' | 'cards' | 'testimonial' | 'contact';
  content: any;
}

export interface PageContent {
  id: string;
  title: string;
  sections: PageSection[];
}

export interface WebsitePagesConfig {
  pages: PageContent[];
  version: string;
  lastModified: number;
}

// Default page data
const DEFAULT_PAGES: PageContent[] = [
  {
    id: 'home',
    title: '首页',
    sections: [
      {
        id: 'hero',
        title: '主横幅',
        type: 'hero',
        content: {
          title: '半导体/集成电路行业生产管理专家',
          subtitle: '15年行业经验，提供专业知识与实践经验分享',
          buttonText: '了解更多',
          buttonLink: '/about'
        }
      },
      {
        id: 'services',
        title: '服务介绍',
        type: 'cards',
        content: {
          title: '我能提供的服务',
          subtitle: '多年行业经验，为您提供专业解决方案',
          items: [
            {
              title: '生产管理',
              description: '提高生产效率，优化生产流程',
              icon: 'chart'
            },
            {
              title: '测试厂建设',
              description: '从规划到实施的全方位咨询',
              icon: 'building'
            },
            {
              title: 'IT系统规划',
              description: '为半导体企业提供信息化解决方案',
              icon: 'computer'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'about',
    title: '关于我',
    sections: [
      {
        id: 'profile',
        title: '个人简介',
        type: 'text',
        content: {
          title: '关于我',
          text: '拥有15年半导体行业经验，专注于生产管理、测试厂建设与IT系统规划...'
        }
      },
      {
        id: 'experience',
        title: '工作经历',
        type: 'cards',
        content: {
          title: '我的经历',
          items: [
            {
              title: '高级生产经理',
              company: 'XX半导体有限公司',
              period: '2018-至今'
            },
            {
              title: '生产主管',
              company: 'XX科技有限公司',
              period: '2015-2018'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'contact',
    title: '联系我',
    sections: [
      {
        id: 'contact-info',
        title: '联系方式',
        type: 'contact',
        content: {
          phone: '13679041859',
          email: '6358000070@qq.com',
          location: '现居成都-郫都区'
        }
      }
    ]
  }
];

/**
 * Get all pages from localStorage
 * @returns Array of page contents
 */
export function getAllPages(): PageContent[] {
  if (typeof window === 'undefined') return DEFAULT_PAGES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with default data
      saveAllPages(DEFAULT_PAGES);
      return DEFAULT_PAGES;
    }

    const pages = JSON.parse(stored);
    return Array.isArray(pages) ? pages : DEFAULT_PAGES;
  } catch (error) {
    console.error('Failed to read pages:', error);
    return DEFAULT_PAGES;
  }
}

/**
 * Save all pages to localStorage
 * @param pages Array of page contents to save
 */
export function saveAllPages(pages: PageContent[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (error) {
    console.error('Failed to save pages:', error);
  }
}

/**
 * Get a single page by ID
 * @param pageId Page ID (e.g., 'about', 'contact')
 * @returns Page content or null if not found
 */
export function getPageById(pageId: string): PageContent | null {
  const pages = getAllPages();
  return pages.find(page => page.id === pageId) || null;
}

/**
 * Get a specific section from a page
 * @param pageId Page ID
 * @param sectionId Section ID
 * @returns Section content or null if not found
 */
export function getSectionById(pageId: string, sectionId: string): PageSection | null {
  const page = getPageById(pageId);
  if (!page) return null;

  return page.sections.find(section => section.id === sectionId) || null;
}

/**
 * Get section content by page and section IDs
 * @param pageId Page ID
 * @param sectionId Section ID
 * @returns Section content or null if not found
 */
export function getSectionContent(pageId: string, sectionId: string): any {
  const section = getSectionById(pageId, sectionId);
  return section?.content || null;
}

/**
 * Save a specific section's content
 * @param pageId Page ID
 * @param sectionId Section ID
 * @param content New content for the section
 * @returns true if saved successfully, false if page or section not found
 */
export function saveSectionContent(pageId: string, sectionId: string, content: any): boolean {
  const pages = getAllPages();
  const pageIndex = pages.findIndex(page => page.id === pageId);

  if (pageIndex === -1) return false;

  const sectionIndex = pages[pageIndex].sections.findIndex(section => section.id === sectionId);
  if (sectionIndex === -1) return false;

  pages[pageIndex].sections[sectionIndex].content = content;
  saveAllPages(pages);
  return true;
}

/**
 * Reset all pages to default
 */
export function resetAllPages(): void {
  saveAllPages(DEFAULT_PAGES);
}
