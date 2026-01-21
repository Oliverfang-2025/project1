import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
  alternates?: {
    languages: {
      zh: string;
      en: string;
    };
  };
}

async function fetchArticles(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles?status=published&limit=1000`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error);
    return [];
  }
}

async function fetchProjects(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/projects?status=published&limit=1000`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error);
    return [];
  }
}

export async function generateDynamicSitemap(): Promise<SitemapEntry[]> {
  const [articles, projects] = await Promise.all([
    fetchArticles(),
    fetchProjects(),
  ]);

  const sitemapEntries: SitemapEntry[] = [];

  // Add articles to sitemap
  articles.forEach((article: any) => {
    const lastModified = new Date(article.updated_at || article.created_at);

    // Chinese version
    sitemapEntries.push({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          zh: `${siteUrl}/blog/${article.slug}`,
          en: `${siteUrl}/en/blog/${article.slug}`,
        },
      },
    });

    // English version
    sitemapEntries.push({
      url: `${siteUrl}/en/blog/${article.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          zh: `${siteUrl}/blog/${article.slug}`,
          en: `${siteUrl}/en/blog/${article.slug}`,
        },
      },
    });
  });

  // Add projects to sitemap
  projects.forEach((project: any) => {
    const lastModified = new Date(project.updated_at || project.created_at);

    // Chinese version
    sitemapEntries.push({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          zh: `${siteUrl}/projects/${project.slug}`,
          en: `${siteUrl}/en/projects/${project.slug}`,
        },
      },
    });

    // English version
    sitemapEntries.push({
      url: `${siteUrl}/en/projects/${project.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          zh: `${siteUrl}/projects/${project.slug}`,
          en: `${siteUrl}/en/projects/${project.slug}`,
        },
      },
    });
  });

  return sitemapEntries;
}
