import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

interface PageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
}

export function generatePageMetadata({
  locale,
  title,
  description,
  path,
  image = '/og-image.png',
  keywords = [],
  type = 'website',
}: PageMetadataOptions): Metadata {
  const fullTitle = locale === 'zh'
    ? `${title} - Oliver Fang`
    : `${title} - Oliver Fang`;

  const defaultKeywords = locale === 'zh'
    ? ['半导体', '集成电路', '芯片设计', 'IC设计', 'Oliver Fang']
    : ['semiconductor', 'IC', 'chip design', 'Oliver Fang'];

  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    alternates: {
      canonical: path,
      languages: {
        'zh': path.replace('/en', '/').replace('/zh', '/'),
        'en': path.startsWith('/zh') ? path.replace('/zh', '/en') : `/en${path}`,
      },
    },
    openGraph: {
      type,
      locale,
      alternateLocale: locale === 'zh' ? 'en' : 'zh',
      url: `${siteUrl}${path}`,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
