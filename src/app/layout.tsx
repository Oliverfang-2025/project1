import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import dynamic from 'next/dynamic';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// Dynamic import DifyChat to reduce initial bundle size
const DifyChat = dynamic(() => import('@/components/DifyChat'), {
  ssr: false,
  loading: () => null,
});

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

  const title = 'Oliver Fang - 半导体/集成电路行业专家';
  const description = '半导体/集成电路行业生产管理专家，分享专业知识与职业经验，记录个人成长。专注芯片设计、验证与生产管理。';
  const keywords = '半导体, 集成电路, 芯片设计, IC设计, UVM验证, 数字电路, 模拟电路, FPGA, 嵌入式开发, 生产管理';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    authors: [{ name: 'Oliver Fang' }],
    creator: 'Oliver Fang',
    publisher: 'Oliver Fang',
    alternates: {
      canonical: '/',
      languages: {
        'zh': '/',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      url: '/',
      title,
      description,
      siteName: 'Oliver Fang',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
      creator: '@oliverfang',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: any;
}) {
  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <DifyChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 