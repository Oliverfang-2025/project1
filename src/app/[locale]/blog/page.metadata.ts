import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'zh' ? '技术博客' : 'Blog';
  const description = locale === 'zh'
    ? '分享技术见解与实践经验，涵盖半导体、集成电路、芯片设计、UVM验证等领域的技术文章和教程。'
    : 'Sharing technical insights and practical experience, covering semiconductor, IC, chip design, UVM verification and more.';

  return generatePageMetadata({
    locale,
    title,
    description,
    path: locale === 'zh' ? '/blog' : '/en/blog',
    keywords: locale === 'zh'
      ? ['技术博客', '半导体技术', '芯片设计', 'UVM教程', 'IC验证']
      : ['tech blog', 'semiconductor', 'chip design', 'UVM tutorial', 'IC verification'],
  });
}
