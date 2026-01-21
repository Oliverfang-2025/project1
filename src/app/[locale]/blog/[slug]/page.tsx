"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Calendar, Eye, Clock, User, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/seo/JsonLd';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import 'highlight.js/styles/github-dark.css';

interface Article {
  id: number;
  title_zh: string;
  title_en: string;
  slug: string;
  content_zh: string;
  content_en: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string | null;
  view_count: number;
  created_at: string;
  published_at: string;
}

interface RelatedArticle {
  id: number;
  title_zh: string;
  title_en: string;
  slug: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string | null;
  category: string | null;
  published_at: string;
}

export default function BlogPostPage() {
  const t = useTranslations('blog');
  const common = useTranslations('common');
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Ensure slug is a string
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugStr]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${slugStr}`);
      const data = await response.json();

      if (data.data) {
        setArticle(data.data);

        // Increment view count
        incrementViewCount(slugStr);

        // Fetch related articles (same category, excluding current)
        if (data.data.category) {
          fetchRelatedArticles(data.data.category, data.data.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (articleSlug: string) => {
    try {
      await fetch(`/api/articles/${articleSlug}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const fetchRelatedArticles = async (category: string, currentId: number) => {
    try {
      const response = await fetch(
        `/api/articles?category=${category}&status=published&limit=3`
      );
      const data = await response.json();

      // Filter out current article and take first 3
      const related = (data.data || [])
        .filter((a: Article) => a.id !== currentId)
        .slice(0, 3);

      setRelatedArticles(related);
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === 'zh' ? article?.title_zh : article?.title_en,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const calculateReadingTime = (content: string) => {
    if (!content) return 1;
    const wordsPerMinute = locale === 'zh' ? 400 : 200;
    const wordCount = content.length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return locale === 'zh'
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const content = locale === 'zh' ? article?.content_zh : article?.content_en;
  const title = locale === 'zh' ? article?.title_zh : article?.title_en;
  const excerpt = locale === 'zh' ? article?.excerpt_zh : article?.excerpt_en;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-foreground-muted">{common('loading')}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link href={`/${locale}/blog`}>
            <Button variant="outline">{t('back_to_list')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data
  const articleSchema = generateArticleSchema(article, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'zh' ? '首页' : 'Home', path: '' },
    { name: locale === 'zh' ? '技术博客' : 'Blog', path: '/blog' },
    { name: title, path: `/blog/${slugStr}` }
  ], locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      {/* Structured Data */}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Hero Section */}
      {article.cover_image && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={article.cover_image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      )}

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button & Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back_to_list')}
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t('copy_link')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('copy_link')}
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {t('share')}
            </Button>
          </div>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            {article.category && (
              <span className="px-3 py-1 text-sm font-medium bg-primary-500/20 text-primary-400 rounded">
                {article.category}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {title}
          </h1>
          <p className="text-xl text-foreground-muted mb-6">{excerpt}</p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author || 'Admin'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.view_count} {t('views')}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {calculateReadingTime(content || '')} {t('minutes')}
            </span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-background-tertiary text-foreground-muted rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          {content && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          )}
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t('related_articles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/${locale}/blog/${related.slug}`}>
                  <Card className="h-full hover:border-primary-500/50 transition-all duration-300 cursor-pointer group">
                    {related.cover_image && (
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <Image
                          src={related.cover_image}
                          alt={locale === 'zh' ? related.title_zh : related.title_en}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                        {locale === 'zh' ? related.title_zh : related.title_en}
                      </h3>
                      <p className="text-sm text-foreground-muted line-clamp-2">
                        {locale === 'zh' ? related.excerpt_zh : related.excerpt_en}
                      </p>
                      <span className="text-xs text-foreground-muted mt-2 block">
                        {formatDate(related.published_at)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}
