import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'zh' ? '项目作品' : 'Projects';
  const description = locale === 'zh'
    ? '我的个人项目和开源贡献，展示在半导体、集成电路、嵌入式开发等领域的实践项目。'
    : 'My personal projects and open source contributions, showcasing practical projects in semiconductor, IC, and embedded development.';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: locale === 'zh' ? '/projects' : '/en/projects',
    keywords: locale === 'zh'
      ? ['项目展示', '开源项目', '个人作品', '项目案例']
      : ['projects', 'open source', 'portfolio', 'case studies'],
  });
}
