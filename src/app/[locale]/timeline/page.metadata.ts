import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'zh' ? '时间线' : 'Timeline';
  const description = locale === 'zh'
    ? '记录职业发展与成长历程，展示工作经历、教育背景和重要成就的时间线。'
    : 'Documenting career development and growth journey, showcasing work experience, education, and important achievements.';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: locale === 'zh' ? '/timeline' : '/en/timeline',
    keywords: locale === 'zh'
      ? ['职业发展', '成长历程', '时间线', '里程碑']
      : ['career development', 'growth journey', 'timeline', 'milestones'],
  });
}
