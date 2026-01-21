"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Calendar, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import {
  PageWrapper,
  StaggerWrapper,
  StaggerItem,
  HoverCard
} from '@/components/animations';

interface Article {
  id: number;
  title_zh: string;
  title_en: string;
  slug: string;
  excerpt_zh: string;
  excerpt_en: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  view_count: number;
  created_at: string;
  published_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function BlogPage() {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [articles, setArticles] = useState([] as Article[]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  } as Pagination);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchArticles = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        status: 'published'
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      setArticles(data.data || []);
      setPagination(data.pagination || pagination);

      const uniqueCategories = Array.from(
        new Set((data.data || []).map((a: Article) => a.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    fetchArticles(1);
  };

  const handlePageChange = (page: number) => {
    fetchArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateReadingTime = (content: string) => {
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

  return (
    <PageWrapper className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient-tech">
              {t('title')}
            </h1>
            <p className="text-xl text-foreground-muted mb-8">
              {t('subtitle')}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="primary">
                {t('search_btn')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={!selectedCategory ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              {t('all_categories')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-foreground-muted">{t('loading')}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-foreground-muted">{t('no_articles')}</p>
          </div>
        ) : (
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <StaggerItem key={article.id}>
                <Link href={`/${locale}/blog/${article.slug}`} className="block">
                  <HoverCard className="h-full">
                    <Card className="h-full hover:border-primary-500/50 transition-all duration-300 cursor-pointer group">
                      {article.cover_image && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={article.cover_image}
                            alt={locale === 'zh' ? article.title_zh : article.title_en}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent"></div>
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          {article.category && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded">
                              {article.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-400 transition-colors line-clamp-2">
                          {locale === 'zh' ? article.title_zh : article.title_en}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-foreground-muted text-sm line-clamp-3">
                          {locale === 'zh' ? article.excerpt_zh : article.excerpt_en}
                        </p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between text-xs text-foreground-muted">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.published_at || article.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.view_count}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {calculateReadingTime(locale === 'zh' ? article.excerpt_zh : article.excerpt_en)} {t('minutes')}
                        </span>
                      </CardFooter>
                    </Card>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerWrapper>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              {t('previous')}
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={pagination.page === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              {t('next')}
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
