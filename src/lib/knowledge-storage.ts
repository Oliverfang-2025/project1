// localStorage utilities for knowledge management

import { KnowledgeConfig, Article, SAMPLE_ARTICLES } from '@/types/knowledge';

const STORAGE_KEY = 'knowledge_articles';

/**
 * Get all articles from localStorage
 * @returns Array of articles
 */
export function getArticles(): Article[] {
  if (typeof window === 'undefined') return SAMPLE_ARTICLES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with sample data
      saveArticles(SAMPLE_ARTICLES);
      return SAMPLE_ARTICLES;
    }

    const config: KnowledgeConfig = JSON.parse(stored);
    return config.articles;
  } catch (error) {
    console.error('Failed to read articles:', error);
    return SAMPLE_ARTICLES;
  }
}

/**
 * Save articles to localStorage
 * @param articles Array of articles to save
 */
export function saveArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;

  try {
    const config: KnowledgeConfig = {
      articles,
      version: '1.0.0',
      lastModified: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save articles:', error);
  }
}

/**
 * Get a single article by ID
 * @param id Article ID
 * @returns Article or null if not found
 */
export function getArticleById(id: string): Article | null {
  const articles = getArticles();
  return articles.find(article => article.id === id) || null;
}

/**
 * Add a new article
 * @param article Article to add
 * @returns The added article with generated ID
 */
export function addArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
  const articles = getArticles();
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  articles.push(newArticle);
  saveArticles(articles);
  return newArticle;
}

/**
 * Update an existing article
 * @param id Article ID
 * @param updates Partial article data to update
 * @returns Updated article or null if not found
 */
export function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Article | null {
  const articles = getArticles();
  const index = articles.findIndex(article => article.id === id);

  if (index === -1) return null;

  const updatedArticle: Article = {
    ...articles[index],
    ...updates,
    updatedAt: Date.now()
  };

  articles[index] = updatedArticle;
  saveArticles(articles);
  return updatedArticle;
}

/**
 * Delete an article
 * @param id Article ID
 * @returns true if deleted, false if not found
 */
export function deleteArticle(id: string): boolean {
  const articles = getArticles();
  const filtered = articles.filter(article => article.id !== id);

  if (filtered.length === articles.length) return false;

  saveArticles(filtered);
  return true;
}

/**
 * Get free articles only
 * @returns Array of free articles
 */
export function getFreeArticles(): Article[] {
  return getArticles().filter(article => article.type === 'free');
}

/**
 * Get paid articles only
 * @returns Array of paid articles
 */
export function getPaidArticles(): Article[] {
  return getArticles().filter(article => article.type === 'paid');
}
