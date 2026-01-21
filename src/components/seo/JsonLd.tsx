"use client";

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Add JSON-LD script to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

// Helper functions for generating structured data

export function generatePersonSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Oliver Fang',
    jobTitle: locale === 'zh'
      ? '半导体/集成电路行业生产管理专家'
      : 'Semiconductor/IC Industry Production Management Expert',
    description: locale === 'zh'
      ? '专注于半导体和集成电路行业的生产管理，拥有丰富的芯片设计、验证和生产管理经验'
      : 'Specializing in semiconductor and IC industry production management, with extensive experience in chip design, verification, and production management',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com',
    sameAs: [
      'https://github.com/oliverfang',
      'https://linkedin.com/in/oliverfang',
    ],
    knowsAbout: locale === 'zh'
      ? ['半导体', '集成电路', '芯片设计', 'UVM验证', '生产管理']
      : ['semiconductor', 'IC', 'chip design', 'UVM verification', 'production management'],
  };
}

export function generateArticleSchema(article: any, locale: string) {
  const title = locale === 'zh' ? article.title_zh : article.title_en;
  const description = locale === 'zh' ? article.excerpt_zh : article.excerpt_en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: article.cover_image || `${siteUrl}/og-image.png`,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: 'Oliver Fang',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Oliver Fang',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${locale}/blog/${article.slug}`,
    },
    keywords: article.tags?.join(', ') || '',
  };
}

export function generateProjectSchema(project: any, locale: string) {
  const title = locale === 'zh' ? project.title_zh : project.title_en;
  const description = locale === 'zh' ? project.description_zh : project.description_en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    image: project.cover_image || `${siteUrl}/og-image.png`,
    dateCreated: project.created_at,
    dateModified: project.updated_at || project.created_at,
    author: {
      '@type': 'Person',
      name: 'Oliver Fang',
    },
    keywords: project.tech_stack?.join(', ') || '',
    url: `${siteUrl}/${locale}/projects/${project.slug}`,
    programmingLanguage: project.tech_stack || [],
    genre: 'Technology',
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; path: string }>, locale: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}/${locale}${item.path}`,
    })),
  };
}

export function generateWebSiteSchema(locale: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oliverfang.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oliver Fang',
    url: siteUrl,
    description: locale === 'zh'
      ? '半导体/集成电路行业生产管理专家，分享专业知识与职业经验，记录个人成长'
      : 'Semiconductor/IC industry production management expert, sharing professional knowledge and career experience',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
