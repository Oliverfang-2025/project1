import { MetadataRoute } from 'next';
import { generateDynamicSitemap } from '@/lib/dynamic-sitemap';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    '',
    '/about',
    '/blog',
    '/projects',
    '/timeline',
    '/contact',
  ];

  // Generate sitemap entries for both locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach(route => {
    // Chinese version
    sitemapEntries.push({
      url: `${siteUrl}${route === '' ? '' : '/' + route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          zh: `${siteUrl}${route === '' ? '' : '/' + route}`,
          en: `${siteUrl}/en${route === '' ? '' : '/' + route}`,
        },
      },
    });

    // English version
    sitemapEntries.push({
      url: `${siteUrl}/en${route === '' ? '' : '/' + route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 0.9 : 0.7,
      alternates: {
        languages: {
          zh: `${siteUrl}${route === '' ? '' : '/' + route}`,
          en: `${siteUrl}/en${route === '' ? '' : '/' + route}`,
        },
      },
    });
  });

  // Add dynamic entries (articles and projects)
  const dynamicEntries = await generateDynamicSitemap();
  sitemapEntries.push(...dynamicEntries);

  return sitemapEntries;
}
