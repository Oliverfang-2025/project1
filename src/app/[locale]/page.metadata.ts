import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'zh' ? '首页' : 'Home';
  const description = locale === 'zh'
    ? 'Oliver Fang - 半导体/集成电路行业生产管理专家，分享专业知识与职业经验，记录个人成长。专注芯片设计、验证与生产管理。'
    : 'Oliver Fang - Semiconductor/IC industry production management expert, sharing professional knowledge and career experience. Specializing in chip design, verification, and production management.';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: locale === 'zh' ? '/' : '/en',
    keywords: locale === 'zh'
      ? ['半导体专家', '芯片设计', 'UVM验证', '生产管理']
      : ['semiconductor expert', 'chip design', 'UVM verification', 'production management'],
  });
}
