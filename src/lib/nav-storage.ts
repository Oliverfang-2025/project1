import { NavItem } from '@/types/nav';

const STORAGE_KEY = 'nav_items';

/**
 * Get all navigation items from localStorage
 */
export function getNavItems(): NavItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Return default navigation items if none exist
      return getDefaultNavItems();
    }
    const items = JSON.parse(data);
    // Sort by order field
    return items.sort((a: NavItem, b: NavItem) => a.order - b.order);
  } catch (error) {
    console.error('Error reading navigation items:', error);
    return getDefaultNavItems();
  }
}

/**
 * Save navigation items to localStorage
 */
export function saveNavItems(items: NavItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving navigation items:', error);
  }
}

/**
 * Add a new navigation item
 */
export function addNavItem(item: NavItem): void {
  const items = getNavItems();
  items.push(item);
  saveNavItems(items);
}

/**
 * Update an existing navigation item
 */
export function updateNavItem(id: string, data: Partial<NavItem>): void {
  const items = getNavItems();
  const index = items.findIndex(item => item.id === id);

  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    saveNavItems(items);
  }
}

/**
 * Delete a navigation item
 */
export function deleteNavItem(id: string): void {
  const items = getNavItems();
  const filteredItems = items.filter(item => item.id !== id);
  saveNavItems(filteredItems);
}

/**
 * Get default navigation items
 */
function getDefaultNavItems(): NavItem[] {
  return [
    { id: '1', label: '首页', href: '/', order: 1, visible: true },
    { id: '2', label: '关于我', href: '/about', order: 2, visible: true },
    { id: '3', label: '职业规划', href: '/plans', order: 3, visible: true },
    { id: '4', label: '知识分享', href: '/knowledge', order: 4, visible: true },
    { id: '5', label: '联系方式', href: '/contact', order: 5, visible: true },
  ];
}

/**
 * Initialize default navigation items if none exist
 */
export function initializeDefaultNavItems(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    saveNavItems(getDefaultNavItems());
  }
}
