// localStorage utilities for timeline management

import { TimelineItem } from '@/types/timeline';

const STORAGE_KEY = 'timeline_items';

/**
 * Get all timeline items from localStorage
 * @returns Array of timeline items sorted by date (newest first)
 */
export function getTimelineItems(): TimelineItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items: TimelineItem[] = JSON.parse(stored);
    // Sort by date (newest first)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to read timeline items:', error);
    return [];
  }
}

/**
 * Save timeline items to localStorage
 * @param items Array of timeline items to save
 */
export function saveTimelineItems(items: TimelineItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save timeline items:', error);
  }
}

/**
 * Add a single timeline item
 * @param item Timeline item to add
 */
export function addTimelineItem(item: TimelineItem): void {
  const items = getTimelineItems();
  items.push(item);
  saveTimelineItems(items);
}

/**
 * Update an existing timeline item
 * @param id ID of the item to update
 * @param data Partial data to update
 */
export function updateTimelineItem(id: string, data: Partial<TimelineItem>): void {
  const items = getTimelineItems();
  const index = items.findIndex(item => item.id === id);

  if (index !== -1) {
    items[index] = { ...items[index], ...data };
    saveTimelineItems(items);
  }
}

/**
 * Delete a timeline item
 * @param id ID of the item to delete
 */
export function deleteTimelineItem(id: string): void {
  const items = getTimelineItems();
  const filteredItems = items.filter(item => item.id !== id);
  saveTimelineItems(filteredItems);
}
