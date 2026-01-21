import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // Fetch project data for dynamic metadata
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/projects/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await response.json();

    if (data.data) {
      const project = data.data;
      const title = locale === 'zh' ? project.title_zh : project.title_en;
      const description = locale === 'zh' ? project.description_zh : project.description_en;
      const image = project.cover_image || '/og-image.png';

      return generatePageMetadata({
        locale,
        title,
        description,
        path: `/${locale}/projects/${slug}`,
        image,
        keywords: project.tech_stack || [],
      });
    }
  } catch (error) {
    console.error('Failed to fetch project metadata:', error);
  }

  // Fallback metadata
  const title = locale === 'zh' ? '项目详情' : 'Project Details';
  const description = locale === 'zh'
    ? '查看项目详细信息和技术实现'
    : 'View project details and technical implementation';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: `/${locale}/projects/${slug}`,
  });
}
