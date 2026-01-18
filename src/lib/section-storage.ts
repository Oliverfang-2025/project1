// localStorage utilities for section configuration management

import { HomeSectionsConfig, SectionConfig, DEFAULT_SECTIONS } from '@/types/section-config';

const STORAGE_KEY = 'home_sections_config';

/**
 * Get all sections configuration from localStorage
 * @returns Array of section configurations
 */
export function getSectionsConfig(): SectionConfig[] {
  if (typeof window === 'undefined') return DEFAULT_SECTIONS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with default configuration
      saveSectionsConfig(DEFAULT_SECTIONS);
      return DEFAULT_SECTIONS;
    }

    const config: HomeSectionsConfig = JSON.parse(stored);
    return config.sections;
  } catch (error) {
    console.error('Failed to read sections config:', error);
    return DEFAULT_SECTIONS;
  }
}

/**
 * Save sections configuration to localStorage
 * @param sections Array of section configurations to save
 */
export function saveSectionsConfig(sections: SectionConfig[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: HomeSectionsConfig = {
      sections,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save sections config:', error);
  }
}

/**
 * Reset sections configuration to default
 */
export function resetSectionsConfig(): void {
  saveSectionsConfig(DEFAULT_SECTIONS);
}

/**
 * Get only visible sections, sorted by order
 * @returns Array of visible section configurations sorted by order
 */
export function getVisibleSections(): SectionConfig[] {
  return getSectionsConfig()
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
}
