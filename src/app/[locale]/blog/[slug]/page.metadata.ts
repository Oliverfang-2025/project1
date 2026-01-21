import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // Fetch article data for dynamic metadata
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await response.json();

    if (data.data) {
      const article = data.data;
      const title = locale === 'zh' ? article.title_zh : article.title_en;
      const description = locale === 'zh' ? article.excerpt_zh : article.excerpt_en;
      const image = article.cover_image || '/og-image.png';

      return generatePageMetadata({
        locale,
        title,
        description,
        path: `/${locale}/blog/${slug}`,
        image,
        keywords: article.tags || [],
        type: 'article',
      });
    }
  } catch (error) {
    console.error('Failed to fetch article metadata:', error);
  }

  // Fallback metadata
  const title = locale === 'zh' ? '博客文章' : 'Blog Post';
  const description = locale === 'zh'
    ? '阅读更多关于半导体和集成电路的技术文章'
    : 'Read more technical articles about semiconductor and IC';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: `/${locale}/blog/${slug}`,
    type: 'article',
  });
}
