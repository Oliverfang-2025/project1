import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'zh' ? '关于我' : 'About Me';
  const description = locale === 'zh'
    ? '了解更多关于 Oliver Fang 的信息，包括工作经历、教育背景、专业技能和资质认证。半导体/集成电路行业生产管理专家。'
    : 'Learn more about Oliver Fang, including work experience, education, skills, and certifications. Semiconductor/IC industry production management expert.';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: locale === 'zh' ? '/about' : '/en/about',
    keywords: locale === 'zh'
      ? ['个人简介', '工作经历', '教育背景', '专业技能']
      : ['about', 'biography', 'experience', 'education', 'skills'],
  });
}
